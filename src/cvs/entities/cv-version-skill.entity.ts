import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { CvVersion } from './cv-version.entity';
import { Skill } from './skill.entity';

@Entity({ name: 'cv_version_skills' })
@Unique('uq_cv_version_skills', ['cvVersionId', 'skillId'])
export class CvVersionSkill {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ name: 'cv_version_id', type: 'bigint' })
  cvVersionId!: string;

  @Column({ name: 'skill_id', type: 'bigint' })
  skillId!: string;

  @Column({ name: 'display_order', type: 'integer', default: 1 })
  displayOrder!: number;

  @ManyToOne(() => CvVersion, (cvVersion) => cvVersion.versionSkills, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cv_version_id' })
  cvVersion!: CvVersion;

  @ManyToOne(() => Skill, (skill) => skill.versionSkills, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'skill_id' })
  skill!: Skill;
}