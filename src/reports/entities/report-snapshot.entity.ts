import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'report_snapshots' })
@Index('idx_report_snapshots_user_id', ['userId'])
@Index('idx_report_snapshots_report_type', ['reportType'])
export class ReportSnapshot {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ name: 'user_id', type: 'bigint' })
  userId!: string;

  @Column({ name: 'report_type', type: 'varchar', length: 50 })
  reportType!: string;

  @Column({ name: 'report_period', type: 'varchar', length: 50, nullable: true })
  reportPeriod!: string | null;

  @Column({ name: 'payload', type: 'jsonb' })
  payload!: Record<string, unknown>;

  @Column({ name: 'generated_at', type: 'timestamptz', default: () => 'NOW()' })
  generatedAt!: Date;

  @ManyToOne(() => User, (user) => user.reportSnapshots, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}