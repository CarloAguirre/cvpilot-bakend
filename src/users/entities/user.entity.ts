import {
  Column,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SoftDeleteEntity } from '../../common/entities/timestamped.entity';
import { UserStatus } from '../../common/enums/database.enums';
import { AuditLog } from '../../audit/entities/audit-log.entity';
import { Cv } from '../../cvs/entities/cv.entity';
import { SystemEvent } from '../../events/entities/system-event.entity';
import { UploadedFile } from '../../files/entities/uploaded-file.entity';
import { CvImprovementRequest } from '../../improvements/entities/cv-improvement-request.entity';
import { ReportSnapshot } from '../../reports/entities/report-snapshot.entity';
import { UserSetting } from './user-setting.entity';

@Entity({ name: 'users' })
@Index('idx_users_status', ['status'])
export class User extends SoftDeleteEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ name: 'full_name', type: 'varchar', length: 150 })
  fullName!: string;

  @Column({ name: 'email', type: 'varchar', length: 150, unique: true })
  email!: string;

  @Column({ name: 'password_hash', type: 'text' })
  passwordHash!: string;

  @Column({
    name: 'password_reset_token_hash',
    type: 'text',
    nullable: true,
  })
  passwordResetTokenHash!: string | null;

  @Column({
    name: 'password_reset_expires_at',
    type: 'timestamptz',
    nullable: true,
  })
  passwordResetExpiresAt!: Date | null;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 20,
    default: UserStatus.ACTIVE,
  })
  status!: UserStatus;

  @Column({ name: 'last_login_at', type: 'timestamptz', nullable: true })
  lastLoginAt!: Date | null;

  @OneToOne(() => UserSetting, (userSetting) => userSetting.user)
  setting!: UserSetting;

  @OneToMany(() => Cv, (cv) => cv.user)
  cvs!: Cv[];

  @OneToMany(() => UploadedFile, (uploadedFile) => uploadedFile.user)
  uploadedFiles!: UploadedFile[];

  @OneToMany(
    () => CvImprovementRequest,
    (cvImprovementRequest) => cvImprovementRequest.user,
  )
  cvImprovementRequests!: CvImprovementRequest[];

  @OneToMany(() => ReportSnapshot, (reportSnapshot) => reportSnapshot.user)
  reportSnapshots!: ReportSnapshot[];

  @OneToMany(() => AuditLog, (auditLog) => auditLog.changedByUser)
  auditLogs!: AuditLog[];

  @OneToMany(() => SystemEvent, (systemEvent) => systemEvent.user)
  systemEvents!: SystemEvent[];
}