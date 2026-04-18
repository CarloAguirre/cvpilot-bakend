import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreatedUpdatedEntity } from '../../common/entities/timestamped.entity';
import { CvImprovementRequestStatus } from '../../common/enums/database.enums';
import { CvVersion } from '../../cvs/entities/cv-version.entity';
import { Cv } from '../../cvs/entities/cv.entity';
import { UploadedFile } from '../../files/entities/uploaded-file.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'cv_improvement_requests' })
@Index('idx_cv_improvement_requests_user_id', ['userId'])
@Index('idx_cv_improvement_requests_cv_id', ['cvId'])
@Index('idx_cv_improvement_requests_status', ['status'])
@Index('idx_cv_improvement_requests_created_at', ['createdAt'])
export class CvImprovementRequest extends CreatedUpdatedEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ name: 'user_id', type: 'bigint' })
  userId!: string;

  @Column({ name: 'cv_id', type: 'bigint', nullable: true })
  cvId!: string | null;

  @Column({ name: 'uploaded_file_id', type: 'bigint' })
  uploadedFileId!: string;

  @Column({ name: 'target_role', type: 'varchar', length: 150 })
  targetRole!: string;

  @Column({ name: 'job_description', type: 'text', nullable: true })
  jobDescription!: string | null;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 20,
    default: CvImprovementRequestStatus.PENDING,
  })
  status!: CvImprovementRequestStatus;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage!: string | null;

  @Column({ name: 'result_cv_version_id', type: 'bigint', nullable: true })
  resultCvVersionId!: string | null;

  @ManyToOne(() => User, (user) => user.cvImprovementRequests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Cv, (cv) => cv.improvementRequests, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'cv_id' })
  cv!: Cv | null;

  @ManyToOne(
    () => UploadedFile,
    (uploadedFile) => uploadedFile.cvImprovementRequests,
    { onDelete: 'RESTRICT' },
  )
  @JoinColumn({ name: 'uploaded_file_id' })
  uploadedFile!: UploadedFile;

  @ManyToOne(
    () => CvVersion,
    (cvVersion) => cvVersion.improvementRequestResults,
    {
      nullable: true,
      onDelete: 'SET NULL',
    },
  )
  @JoinColumn({ name: 'result_cv_version_id' })
  resultCvVersion!: CvVersion | null;
}