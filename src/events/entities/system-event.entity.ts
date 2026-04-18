import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CvVersion } from '../../cvs/entities/cv-version.entity';
import { Cv } from '../../cvs/entities/cv.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'system_events' })
@Index('idx_system_events_user_id', ['userId'])
@Index('idx_system_events_cv_id', ['cvId'])
@Index('idx_system_events_cv_version_id', ['cvVersionId'])
@Index('idx_system_events_event_type', ['eventType'])
@Index('idx_system_events_created_at', ['createdAt'])
export class SystemEvent {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ name: 'user_id', type: 'bigint' })
  userId!: string;

  @Column({ name: 'cv_id', type: 'bigint', nullable: true })
  cvId!: string | null;

  @Column({ name: 'cv_version_id', type: 'bigint', nullable: true })
  cvVersionId!: string | null;

  @Column({ name: 'event_type', type: 'varchar', length: 50 })
  eventType!: string;

  @Column({ name: 'event_detail', type: 'text', nullable: true })
  eventDetail!: string | null;

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'NOW()' })
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.systemEvents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Cv, (cv) => cv.systemEvents, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'cv_id' })
  cv!: Cv | null;

  @ManyToOne(() => CvVersion, (cvVersion) => cvVersion.systemEvents, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'cv_version_id' })
  cvVersion!: CvVersion | null;
}