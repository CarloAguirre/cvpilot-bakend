import { CreateReportSnapshotDto } from './dto/create-report-snapshot.dto';
import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getDashboardSummary(userId: string): Promise<{
        totalCvs: number;
        totalVersions: number;
        totalCreatedVersions: number;
        totalImprovedVersions: number;
        lastActivityAt: string | Date | null;
    }>;
    getReportsByRole(userId: string): Promise<{
        targetRole: string;
        totalVersions: number;
    }[]>;
    getReportsByVersionType(userId: string): Promise<{
        versionType: string | null | undefined;
        totalVersions: number;
    }[]>;
    getMonthlyReports(userId: string): Promise<{
        reportYear: number;
        reportMonth: number;
        totalVersions: number;
    }[]>;
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
    createDatabaseSnapshot(userId: string): Promise<{
        id: string;
        userId: string;
        reportType: string;
        reportPeriod: string | null;
        payload: Record<string, unknown>;
        generatedAt: Date;
    }>;
}
