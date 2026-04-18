import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreatedUpdatedEntity } from '../../common/entities/timestamped.entity';
import { CvVersion } from './cv-version.entity';

@Entity({ name: 'cv_work_experiences' })
@Index('idx_cv_work_experiences_cv_version_id', ['cvVersionId'])
export class CvWorkExperience extends CreatedUpdatedEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ name: 'cv_version_id', type: 'bigint' })
  cvVersionId!: string;

  @Column({ name: 'company_name', type: 'varchar', length: 150 })
  companyName!: string;

  @Column({ name: 'job_title', type: 'varchar', length: 150 })
  jobTitle!: string;

  @Column({ name: 'period_label', type: 'varchar', length: 100 })
  periodLabel!: string;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate!: string | null;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate!: string | null;

  @Column({ name: 'is_current', type: 'boolean', default: false })
  isCurrent!: boolean;

  @Column({ name: 'description', type: 'text', nullable: true })
  description!: string | null;

  @Column({ name: 'display_order', type: 'integer', default: 1 })
  displayOrder!: number;

  @ManyToOne(() => CvVersion, (cvVersion) => cvVersion.workExperiences, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cv_version_id' })
  cvVersion!: CvVersion;
}