import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedAtEntity } from '../../common/entities/timestamped.entity';
import { CvVersionSkill } from './cv-version-skill.entity';

@Entity({ name: 'skills' })
@Index('idx_skills_category', ['category'])
export class Skill extends CreatedAtEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name!: string;

  @Column({ name: 'normalized_name', type: 'varchar', length: 100, unique: true })
  normalizedName!: string;

  @Column({ name: 'category', type: 'varchar', length: 50, nullable: true })
  category!: string | null;

  @OneToMany(() => CvVersionSkill, (cvVersionSkill) => cvVersionSkill.skill)
  versionSkills!: CvVersionSkill[];
}