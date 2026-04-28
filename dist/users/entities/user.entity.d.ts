import { SoftDeleteEntity } from '../../common/entities/timestamped.entity';
import { UserStatus } from '../../common/enums/database.enums';
import { AuditLog } from '../../audit/entities/audit-log.entity';
import { Cv } from '../../cvs/entities/cv.entity';
import { SystemEvent } from '../../events/entities/system-event.entity';
import { UploadedFile } from '../../files/entities/uploaded-file.entity';
import { CvImprovementRequest } from '../../improvements/entities/cv-improvement-request.entity';
import { ReportSnapshot } from '../../reports/entities/report-snapshot.entity';
import { UserSetting } from './user-setting.entity';
export declare class User extends SoftDeleteEntity {
    id: string;
    fullName: string;
    email: string;
    passwordHash: string;
    passwordResetTokenHash: string | null;
    passwordResetExpiresAt: Date | null;
    status: UserStatus;
    lastLoginAt: Date | null;
    setting: UserSetting;
    cvs: Cv[];
    uploadedFiles: UploadedFile[];
    cvImprovementRequests: CvImprovementRequest[];
    reportSnapshots: ReportSnapshot[];
    auditLogs: AuditLog[];
    systemEvents: SystemEvent[];
}
