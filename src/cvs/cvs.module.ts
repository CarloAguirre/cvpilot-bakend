import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvsController } from './cvs.controller';
import { CvsService } from './cvs.service';
import { CvEducationEntry } from './entities/cv-education-entry.entity';
import { CvPersonalDetail } from './entities/cv-personal-detail.entity';
import { CvVersionSkill } from './entities/cv-version-skill.entity';
import { CvVersion } from './entities/cv-version.entity';
import { CvWorkExperience } from './entities/cv-work-experience.entity';
import { Cv } from './entities/cv.entity';
import { Skill } from './entities/skill.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cv,
      CvVersion,
      CvPersonalDetail,
      CvWorkExperience,
      CvEducationEntry,
      Skill,
      CvVersionSkill,
    ]),
  ],
  controllers: [CvsController],
  providers: [CvsService],
  exports: [TypeOrmModule, CvsService],
})
export class CvsModule {}