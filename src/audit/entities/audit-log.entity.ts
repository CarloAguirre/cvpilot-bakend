import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuditActionType } from '../../common/enums/database.enums';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'audit_logs' })
@Index('idx_audit_logs_table_record', ['tableName', 'recordId'])
@Index('idx_audit_logs_changed_at', ['changedAt'])
export class AuditLog {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ name: 'table_name', type: 'varchar', length: 100 })
  tableName!: string;

  @Column({ name: 'record_id', type: 'bigint' })
  recordId!: string;

  @Column({ name: 'action_type', type: 'varchar', length: 10 })
  actionType!: AuditActionType;

  @Column({ name: 'changed_by_user_id', type: 'bigint', nullable: true })
  changedByUserId!: string | null;

  @Column({ name: 'old_data', type: 'jsonb', nullable: true })
  oldData!: Record<string, unknown> | null;

  @Column({ name: 'new_data', type: 'jsonb', nullable: true })
  newData!: Record<string, unknown> | null;

  @Column({ name: 'changed_at', type: 'timestamptz', default: () => 'NOW()' })
  changedAt!: Date;

  @ManyToOne(() => User, (user) => user.auditLogs, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'changed_by_user_id' })
  changedByUser!: User | null;
}