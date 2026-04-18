import { DataSource, Repository } from 'typeorm';
import { CreateReportSnapshotDto } from './dto/create-report-snapshot.dto';
import { ReportSnapshot } from './entities/report-snapshot.entity';
export declare class ReportsService {
    private readonly dataSource;
    readonly reportSnapshotsRepository: Repository<ReportSnapshot>;
    constructor(dataSource: DataSource, reportSnapshotsRepository: Repository<ReportSnapshot>);
    getDashboardSummary(userId: string): Promise<{
        totalCvs: number;
        totalVersions: number;
        totalCreatedVersions: number;
        totalImprovedVersions: number;
        lastActivityAt: any;
    }>;
    getReportsByRole(userId: string): Promise<any>;
    getReportsByVersionType(userId: string): Promise<any>;
    getMonthlyReports(userId: string): Promise<any>;
    listSnapshots(userId: string): Promise<{
        id: string;
        userId: string;
        reportType: string;
        reportPeriod: string | null;
        payload: Record<string, unknown>;
        generatedAt: Date;
    }[]>;
    createSnapshot(userId: string, createReportSnapshotDto: CreateReportSnapshotDto): Promise<{
        id: string;
        userId: string;
        reportType: string;
        reportPeriod: string | null;
        payload: Record<string, unknown>;
        generatedAt: Date;
    }>;
    private buildPayload;
    private toSnapshotResponse;
}
