import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateReportSnapshotDto } from './dto/create-report-snapshot.dto';
import { ReportSnapshot } from './entities/report-snapshot.entity';

type NumericPayloadValue = number | string | null | undefined;

interface CvActivityReportPayload {
  totalCvs?: NumericPayloadValue;
  totalVersions?: NumericPayloadValue;
  createdVersions?: NumericPayloadValue;
  improvedVersions?: NumericPayloadValue;
  lastActivityAt?: string | Date | null;
  topTargetRoles?: Array<{
    targetRole?: string | null;
    totalVersions?: NumericPayloadValue;
  }>;
  versionsByType?: Array<{
    versionType?: string | null;
    totalVersions?: NumericPayloadValue;
  }>;
  monthlyVersions?: Array<{
    reportYear?: NumericPayloadValue;
    reportMonth?: NumericPayloadValue;
    totalVersions?: NumericPayloadValue;
  }>;
}

@Injectable()
export class ReportsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(ReportSnapshot)
    readonly reportSnapshotsRepository: Repository<ReportSnapshot>,
  ) {}

  async getDashboardSummary(userId: string) {
    const payload = await this.getCvActivityReportPayload(userId);

    return {
      totalCvs: this.toNumber(payload.totalCvs),
      totalVersions: this.toNumber(payload.totalVersions),
      totalCreatedVersions: this.toNumber(payload.createdVersions),
      totalImprovedVersions: this.toNumber(payload.improvedVersions),
      lastActivityAt: payload.lastActivityAt ?? null,
    };
  }

  async getReportsByRole(userId: string) {
    const payload = await this.getCvActivityReportPayload(userId);

    return (payload.topTargetRoles ?? [])
      .filter((row) => row.targetRole)
      .map((row) => ({
        targetRole: row.targetRole as string,
        totalVersions: this.toNumber(row.totalVersions),
      }));
  }

  async getReportsByVersionType(userId: string) {
    const payload = await this.getCvActivityReportPayload(userId);

    return (payload.versionsByType ?? [])
      .filter((row) => row.versionType)
      .map((row) => ({
        versionType: row.versionType,
        totalVersions: this.toNumber(row.totalVersions),
      }));
  }

  async getMonthlyReports(userId: string) {
    const payload = await this.getCvActivityReportPayload(userId);

    return (payload.monthlyVersions ?? []).map((row) => ({
      reportYear: this.toNumber(row.reportYear),
      reportMonth: this.toNumber(row.reportMonth),
      totalVersions: this.toNumber(row.totalVersions),
    }));
  }

  async listSnapshots(userId: string) {
    const snapshots = await this.reportSnapshotsRepository.find({
      where: { userId },
      order: { generatedAt: 'DESC' },
    });

    return snapshots.map((snapshot) => this.toSnapshotResponse(snapshot));
  }

  async createSnapshot(
    userId: string,
    createReportSnapshotDto: CreateReportSnapshotDto,
  ) {
    const payload = await this.buildPayload(
      userId,
      createReportSnapshotDto.reportType,
    );

    const snapshot = this.reportSnapshotsRepository.create({
      userId,
      reportType: createReportSnapshotDto.reportType.trim(),
      reportPeriod: createReportSnapshotDto.reportPeriod?.trim() ?? null,
      payload: payload as unknown as Record<string, unknown>,
      generatedAt: new Date(),
    });

    const savedSnapshot = await this.reportSnapshotsRepository.save(snapshot);
    return this.toSnapshotResponse(savedSnapshot);
  }

  async createDatabaseSnapshot(userId: string) {
    const snapshot = await this.generateCvActivitySnapshot(userId);
    return this.toSnapshotResponse(snapshot);
  }

  private async getCvActivityReportPayload(userId: string) {
    const snapshot = await this.generateCvActivitySnapshot(userId);
    return this.toCvActivityReportPayload(snapshot.payload);
  }

  private async generateCvActivitySnapshot(userId: string) {
    await this.dataSource.query(
      'CALL sp_generate_user_cv_report_snapshot($1::bigint)',
      [userId],
    );

    const snapshot = await this.reportSnapshotsRepository.findOne({
      where: {
        userId,
        reportType: 'cv_activity_summary',
      },
      order: { generatedAt: 'DESC' },
    });

    if (!snapshot) {
      throw new InternalServerErrorException(
        'Database report snapshot was not generated',
      );
    }

    return snapshot;
  }

  private toCvActivityReportPayload(payload: unknown): CvActivityReportPayload {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return {};
    }

    return payload as CvActivityReportPayload;
  }

  private toNumber(value: NumericPayloadValue) {
    const numericValue = Number(value ?? 0);
    return Number.isFinite(numericValue) ? numericValue : 0;
  }

  private async buildPayload(userId: string, reportType: string) {
    switch (reportType.trim()) {
      case 'dashboard_summary':
        return this.getDashboardSummary(userId);
      case 'by_role':
        return this.getReportsByRole(userId);
      case 'by_version_type':
        return this.getReportsByVersionType(userId);
      case 'monthly':
        return this.getMonthlyReports(userId);
      default:
        return {
          message: 'Unsupported report type',
          reportType,
        };
    }
  }

  private toSnapshotResponse(snapshot: ReportSnapshot) {
    return {
      id: snapshot.id,
      userId: snapshot.userId,
      reportType: snapshot.reportType,
      reportPeriod: snapshot.reportPeriod,
      payload: snapshot.payload,
      generatedAt: snapshot.generatedAt,
    };
  }
}