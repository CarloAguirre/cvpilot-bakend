import { User } from '../../users/entities/user.entity';
export declare class ReportSnapshot {
    id: string;
    userId: string;
    reportType: string;
    reportPeriod: string | null;
    payload: Record<string, unknown>;
    generatedAt: Date;
    user: User;
}
