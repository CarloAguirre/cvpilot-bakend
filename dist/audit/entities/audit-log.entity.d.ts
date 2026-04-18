import { AuditActionType } from '../../common/enums/database.enums';
import { User } from '../../users/entities/user.entity';
export declare class AuditLog {
    id: string;
    tableName: string;
    recordId: string;
    actionType: AuditActionType;
    changedByUserId: string | null;
    oldData: Record<string, unknown> | null;
    newData: Record<string, unknown> | null;
    changedAt: Date;
    changedByUser: User | null;
}
