import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { CreatedUpdatedEntity } from '../../common/entities/timestamped.entity';
import {
  CreatedByProcess,
  CvStylePreset,
  CvVersionType,
  GeneratedFileFormat,
} from '../../common/enums/database.enums';
import { SystemEvent } from '../../events/entities/system-event.entity';
import { CvImprovementRequest } from '../../improvements/entities/cv-improvement-request.entity';
import { Cv } from './cv.entity';
import { CvEducationEntry } from './cv-education-entry.entity';
import { CvPersonalDetail } from './cv-personal-detail.entity';
import { CvVersionSkill } from './cv-version-skill.entity';
import { CvWorkExperience } from './cv-work-experience.entity';

@Entity({ name: 'cv_versions' })
@Unique('uq_cv_versions_cv_version_number', ['cvId', 'versionNumber'])
@Index('idx_cv_versions_cv_id', ['cvId'])
@Index('idx_cv_versions_target_role', ['targetRole'])
@Index('idx_cv_versions_created_at', ['createdAt'])
@Index('idx_cv_versions_is_current', ['cvId', 'isCurrent'])
@Index('uq_cv_versions_one_current_per_cv', ['cvId'], {
  unique: true,
  where: '"is_current" = true',
})
export class CvVersion extends CreatedUpdatedEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ name: 'cv_id', type: 'bigint' })
  cvId!: string;

  @Column({ name: 'version_number', type: 'integer' })
  versionNumber!: number;

  @Column({ name: 'version_type', type: 'varchar', length: 20 })
  versionType!: CvVersionType;

  @Column({ name: 'target_role', type: 'varchar', length: 150 })
  targetRole!: string;

  @Column({ name: 'job_description', type: 'text', nullable: true })
  jobDescription!: string | null;

  @Column({ name: 'summary_text', type: 'text', nullable: true })
  summaryText!: string | null;

  @Column({ name: 'skills_text', type: 'text', nullable: true })
  skillsText!: string | null;

  @Column({
    name: 'style_preset',
    type: 'varchar',
    length: 20,
    default: CvStylePreset.ATS,
  })
  stylePreset!: CvStylePreset;

  @Column({ name: 'generated_file_url', type: 'text', nullable: true })
  generatedFileUrl!: string | null;

  @Column({
    name: 'generated_file_format',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  generatedFileFormat!: GeneratedFileFormat | null;

  @Column({ name: 'is_current', type: 'boolean', default: false })
  isCurrent!: boolean;

  @Column({
    name: 'created_by_process',
    type: 'varchar',
    length: 20,
    default: CreatedByProcess.MANUAL,
  })
  createdByProcess!: CreatedByProcess;

  @ManyToOne(() => Cv, (cv) => cv.versions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cv_id' })
  cv!: Cv;

  @OneToOne(
    () => CvPersonalDetail,
    (cvPersonalDetail) => cvPersonalDetail.cvVersion,
  )
  personalDetail!: CvPersonalDetail;

  @OneToMany(
    () => CvWorkExperience,
    (cvWorkExperience) => cvWorkExperience.cvVersion,
  )
  workExperiences!: CvWorkExperience[];

  @OneToMany(
    () => CvEducationEntry,
    (cvEducationEntry) => cvEducationEntry.cvVersion,
  )
  educationEntries!: CvEducationEntry[];

  @OneToMany(
    () => CvVersionSkill,
    (cvVersionSkill) => cvVersionSkill.cvVersion,
  )
  versionSkills!: CvVersionSkill[];

  @OneToMany(
    () => CvImprovementRequest,
    (cvImprovementRequest) => cvImprovementRequest.resultCvVersion,
  )
  improvementRequestResults!: CvImprovementRequest[];

  @OneToMany(() => SystemEvent, (systemEvent) => systemEvent.cvVersion)
  systemEvents!: SystemEvent[];
}