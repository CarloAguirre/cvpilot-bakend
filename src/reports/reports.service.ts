import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CvVersionType } from '../common/enums/database.enums';
import { CreateReportSnapshotDto } from './dto/create-report-snapshot.dto';
import { ReportSnapshot } from './entities/report-snapshot.entity';

@Injectable()
export class ReportsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(ReportSnapshot)
    readonly reportSnapshotsRepository: Repository<ReportSnapshot>,
  ) {}

  async getDashboardSummary(userId: string) {
    const [totals] = await this.dataSource.query(
      `
        SELECT
          COUNT(DISTINCT c.id)::int AS "totalCvs",
          COUNT(v.id)::int AS "totalVersions",
          COUNT(*) FILTER (WHERE v.version_type = $2)::int AS "totalCreatedVersions",
          COUNT(*) FILTER (WHERE v.version_type = $3)::int AS "totalImprovedVersions",
          MAX(GREATEST(COALESCE(c.updated_at, c.created_at), COALESCE(v.updated_at, v.created_at))) AS "lastActivityAt"
        FROM cvs c
        LEFT JOIN cv_versions v ON v.cv_id = c.id
        WHERE c.user_id = $1
          AND c.deleted_at IS NULL
      `,
      [userId, CvVersionType.CREATED, CvVersionType.IMPROVED],
    );

    return {
      totalCvs: Number(totals?.totalCvs ?? 0),
      totalVersions: Number(totals?.totalVersions ?? 0),
      totalCreatedVersions: Number(totals?.totalCreatedVersions ?? 0),
      totalImprovedVersions: Number(totals?.totalImprovedVersions ?? 0),
      lastActivityAt: totals?.lastActivityAt ?? null,
    };
  }

  async getReportsByRole(userId: string) {
    const rows = await this.dataSource.query(
      `
        SELECT
          v.target_role AS "targetRole",
          COUNT(*)::int AS "totalVersions"
        FROM cv_versions v
        INNER JOIN cvs c ON c.id = v.cv_id
        WHERE c.user_id = $1
          AND c.deleted_at IS NULL
        GROUP BY v.target_role
        ORDER BY "totalVersions" DESC, "targetRole" ASC
      `,
      [userId],
    );

    return rows.map((row: { targetRole: string; totalVersions: number | string }) => ({
      targetRole: row.targetRole,
      totalVersions: Number(row.totalVersions),
    }));
  }

  async getReportsByVersionType(userId: string) {
    const rows = await this.dataSource.query(
      `
        SELECT
          v.version_type AS "versionType",
          COUNT(*)::int AS "totalVersions"
        FROM cv_versions v
        INNER JOIN cvs c ON c.id = v.cv_id
        WHERE c.user_id = $1
          AND c.deleted_at IS NULL
        GROUP BY v.version_type
        ORDER BY "totalVersions" DESC, "versionType" ASC
      `,
      [userId],
    );

    return rows.map(
      (row: { versionType: string; totalVersions: number | string }) => ({
        versionType: row.versionType,
        totalVersions: Number(row.totalVersions),
      }),
    );
  }

  async getMonthlyReports(userId: string) {
    const rows = await this.dataSource.query(
      `
        SELECT
          EXTRACT(YEAR FROM v.created_at)::int AS "reportYear",
          EXTRACT(MONTH FROM v.created_at)::int AS "reportMonth",
          COUNT(*)::int AS "totalVersions"
        FROM cv_versions v
        INNER JOIN cvs c ON c.id = v.cv_id
        WHERE c.user_id = $1
          AND c.deleted_at IS NULL
        GROUP BY EXTRACT(YEAR FROM v.created_at), EXTRACT(MONTH FROM v.created_at)
        ORDER BY "reportYear" ASC, "reportMonth" ASC
      `,
      [userId],
    );

    return rows.map(
      (row: {
        reportYear: number | string;
        reportMonth: number | string;
        totalVersions: number | string;
      }) => ({
        reportYear: Number(row.reportYear),
        reportMonth: Number(row.reportMonth),
        totalVersions: Number(row.totalVersions),
      }),
    );
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
      payload,
      generatedAt: new Date(),
    });

    const savedSnapshot = await this.reportSnapshotsRepository.save(snapshot);
    return this.toSnapshotResponse(savedSnapshot);
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