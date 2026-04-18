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

@Entity({ name: 'cv_education_entries' })
@Index('idx_cv_education_entries_cv_version_id', ['cvVersionId'])
export class CvEducationEntry extends CreatedUpdatedEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ name: 'cv_version_id', type: 'bigint' })
  cvVersionId!: string;

  @Column({ name: 'institution_name', type: 'varchar', length: 150 })
  institutionName!: string;

  @Column({ name: 'degree_title', type: 'varchar', length: 150 })
  degreeTitle!: string;

  @Column({ name: 'period_label', type: 'varchar', length: 100 })
  periodLabel!: string;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate!: string | null;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate!: string | null;

  @Column({ name: 'display_order', type: 'integer', default: 1 })
  displayOrder!: number;

  @ManyToOne(() => CvVersion, (cvVersion) => cvVersion.educationEntries, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cv_version_id' })
  cvVersion!: CvVersion;
}