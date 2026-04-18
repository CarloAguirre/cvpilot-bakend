import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SoftDeleteEntity } from '../../common/entities/timestamped.entity';
import { CvSourceType } from '../../common/enums/database.enums';
import { SystemEvent } from '../../events/entities/system-event.entity';
import { CvImprovementRequest } from '../../improvements/entities/cv-improvement-request.entity';
import { User } from '../../users/entities/user.entity';
import { CvVersion } from './cv-version.entity';

@Entity({ name: 'cvs' })
@Index('idx_cvs_user_id', ['userId'])
@Index('idx_cvs_target_role', ['targetRole'])
@Index('idx_cvs_is_archived', ['isArchived'])
export class Cv extends SoftDeleteEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ name: 'user_id', type: 'bigint' })
  userId!: string;

  @Column({ name: 'title', type: 'varchar', length: 150, nullable: true })
  title!: string | null;

  @Column({ name: 'target_role', type: 'varchar', length: 150 })
  targetRole!: string;

  @Column({
    name: 'source_type',
    type: 'varchar',
    length: 20,
    default: CvSourceType.CREATED,
  })
  sourceType!: CvSourceType;

  @Column({ name: 'current_version_id', type: 'bigint', nullable: true })
  currentVersionId!: string | null;

  @Column({ name: 'is_archived', type: 'boolean', default: false })
  isArchived!: boolean;

  @ManyToOne(() => User, (user) => user.cvs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => CvVersion, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'current_version_id' })
  currentVersion!: CvVersion | null;

  @OneToMany(() => CvVersion, (cvVersion) => cvVersion.cv)
  versions!: CvVersion[];

  @OneToMany(
    () => CvImprovementRequest,
    (cvImprovementRequest) => cvImprovementRequest.cv,
  )
  improvementRequests!: CvImprovementRequest[];

  @OneToMany(() => SystemEvent, (systemEvent) => systemEvent.cv)
  systemEvents!: SystemEvent[];
}