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
}
