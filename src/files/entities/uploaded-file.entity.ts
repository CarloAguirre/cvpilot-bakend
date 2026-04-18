import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreatedAtEntity } from '../../common/entities/timestamped.entity';
import { CvImprovementRequest } from '../../improvements/entities/cv-improvement-request.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'uploaded_files' })
@Index('idx_uploaded_files_user_id', ['userId'])
@Index('idx_uploaded_files_created_at', ['createdAt'])
export class UploadedFile extends CreatedAtEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ name: 'user_id', type: 'bigint' })
  userId!: string;

  @Column({ name: 'original_name', type: 'varchar', length: 255 })
  originalName!: string;

  @Column({ name: 'storage_path', type: 'text' })
  storagePath!: string;

  @Column({ name: 'mime_type', type: 'varchar', length: 100 })
  mimeType!: string;

  @Column({ name: 'file_extension', type: 'varchar', length: 10 })
  fileExtension!: string;

  @Column({ name: 'file_size_bytes', type: 'bigint' })
  fileSizeBytes!: string;

  @Column({ name: 'checksum', type: 'varchar', length: 255, nullable: true })
  checksum!: string | null;

  @ManyToOne(() => User, (user) => user.uploadedFiles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToMany(
    () => CvImprovementRequest,
    (cvImprovementRequest) => cvImprovementRequest.uploadedFile,
  )
  cvImprovementRequests!: CvImprovementRequest[];
}