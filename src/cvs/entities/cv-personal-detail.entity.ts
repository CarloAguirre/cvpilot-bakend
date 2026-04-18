import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreatedUpdatedEntity } from '../../common/entities/timestamped.entity';
import { CvVersion } from './cv-version.entity';

@Entity({ name: 'cv_personal_details' })
@Index('idx_cv_personal_details_email', ['email'])
export class CvPersonalDetail extends CreatedUpdatedEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ name: 'cv_version_id', type: 'bigint', unique: true })
  cvVersionId!: string;

  @Column({ name: 'full_name', type: 'varchar', length: 150 })
  fullName!: string;

  @Column({ name: 'email', type: 'varchar', length: 150 })
  email!: string;

  @Column({ name: 'phone', type: 'varchar', length: 30, nullable: true })
  phone!: string | null;

  @Column({ name: 'location', type: 'varchar', length: 150, nullable: true })
  location!: string | null;

  @Column({
    name: 'professional_summary',
    type: 'text',
    nullable: true,
  })
  professionalSummary!: string | null;

  @OneToOne(() => CvVersion, (cvVersion) => cvVersion.personalDetail, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cv_version_id' })
  cvVersion!: CvVersion;
}