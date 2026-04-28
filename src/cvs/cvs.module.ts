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
import { CvGenerationWorkflowService } from './generation/cv-generation-workflow.service';
import { CvDocumentTextExtractorService } from './generation/cv-document-text-extractor.service';
import { CvPdfRenderService } from './generation/cv-pdf-render.service';
import { CvPromptBuilderService } from './generation/cv-prompt-builder.service';
import { GeneratedDocumentsStorageService } from './generation/generated-documents-storage.service';
import { OpenAiCvGeneratorService } from './generation/openai-cv-generator.service';
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
  providers: [
    CvsService,
    CvDocumentTextExtractorService,
    CvGenerationWorkflowService,
    CvPdfRenderService,
    CvPromptBuilderService,
    GeneratedDocumentsStorageService,
    OpenAiCvGeneratorService,
  ],
  exports: [TypeOrmModule, CvsService, CvGenerationWorkflowService],
})
export class CvsModule {}