import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
export declare class AuditService {
    readonly auditLogsRepository: Repository<AuditLog>;
    constructor(auditLogsRepository: Repository<AuditLog>);
}
