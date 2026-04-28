import { Injectable } from '@nestjs/common';
import {
  CreatedByProcess,
  CvStylePreset,
  CvImprovementRequestStatus,
  CvSourceType,
  GeneratedFileFormat,
} from '../../common/enums/database.enums';
import { CvsService } from '../cvs.service';
import { GenerateCvFromFormDto } from '../dto/generate-cv-from-form.dto';
import { UpdateManualCvVersionDto } from '../dto/update-manual-cv-version.dto';
import { CvImprovementRequest } from '../../improvements/entities/cv-improvement-request.entity';
import { CvDocumentTextExtractorService } from './cv-document-text-extractor.service';
import { CvPdfRenderService } from './cv-pdf-render.service';
import { GeneratedDocumentsStorageService } from './generated-documents-storage.service';
import { OpenAiCvGeneratorService } from './openai-cv-generator.service';

@Injectable()
export class CvGenerationWorkflowService {
  constructor(
    private readonly cvsService: CvsService,
    private readonly cvDocumentTextExtractorService: CvDocumentTextExtractorService,
    private readonly cvPdfRenderService: CvPdfRenderService,
    private readonly generatedDocumentsStorageService: GeneratedDocumentsStorageService,
    private readonly openAiCvGeneratorService: OpenAiCvGeneratorService,
  ) {}

  async generateFromForm(
    userId: string,
    generateCvFromFormDto: GenerateCvFromFormDto,
  ) {
    const generatedContent = await this.openAiCvGeneratorService.generateFromForm(
      generateCvFromFormDto,
    );

    const generatedPdfBuffer = await this.cvPdfRenderService.renderCvPdf({
      title: generateCvFromFormDto.title ?? null,
      targetRole: generatedContent.targetRole,
      personalDetails: generateCvFromFormDto.personalDetails,
      summaryText: generatedContent.summaryText,
      workExperiences: generateCvFromFormDto.workExperiences ?? [],
      educationEntries: generateCvFromFormDto.educationEntries ?? [],
      skills: generatedContent.skills,
    });

    const storedPdf = await this.generatedDocumentsStorageService.storeCvPdf(
      userId,
      generatedPdfBuffer,
    );

    const createdCv = await this.cvsService.createInitialCv(userId, {
      title: generateCvFromFormDto.title,
      targetRole: generateCvFromFormDto.targetRole,
      sourceType: CvSourceType.CREATED,
      stylePreset: generateCvFromFormDto.stylePreset,
      jobDescription: generateCvFromFormDto.jobDescription,
      personalDetails: generateCvFromFormDto.personalDetails,
      workExperiences: generateCvFromFormDto.workExperiences,
      educationEntries: generateCvFromFormDto.educationEntries,
      skills: generateCvFromFormDto.skills,
      skillsText: generateCvFromFormDto.skillsText,
    });

    return this.cvsService.createImprovedVersion(userId, createdCv.id, {
      targetRole: generatedContent.targetRole,
      jobDescription: generateCvFromFormDto.jobDescription,
      summaryText: generatedContent.summaryText,
      skills: generatedContent.skills,
      skillsText: generatedContent.skillsText ?? undefined,
      stylePreset: generateCvFromFormDto.stylePreset,
      generatedFileUrl: storedPdf.publicUrl,
      generatedFileFormat: GeneratedFileFormat.PDF,
      createdByProcess: CreatedByProcess.AI,
      resultSourceType: CvSourceType.CREATED,
    });
  }

  async processImprovementRequest(
    userId: string,
    request: CvImprovementRequest,
  ) {
    if (!request.uploadedFile) {
      throw new Error('Improvement request is missing the uploaded file relation');
    }

    const extractedText = await this.cvDocumentTextExtractorService.extractText(
      request.uploadedFile.storagePath,
      request.uploadedFile.fileExtension,
    );

    const generatedDocumentContent =
      await this.openAiCvGeneratorService.generateFromUploadedDocument({
        originalFileName: request.uploadedFile.originalName,
        targetRole: request.targetRole,
        jobDescription: request.jobDescription,
        extractedText,
      });

    if (request.cvId) {
      const sourceCv = await this.cvsService.getCv(userId, request.cvId);
      const currentVersion = sourceCv.currentVersion;
      const currentPersonalDetail = currentVersion?.personalDetail;
      const currentWorkExperiences = currentVersion?.workExperiences ?? [];
      const currentEducationEntries = currentVersion?.educationEntries ?? [];

      const generatedPdfBuffer = await this.cvPdfRenderService.renderCvPdf({
        title: sourceCv.title,
        targetRole: generatedDocumentContent.improved.targetRole,
        personalDetails: {
          fullName: currentPersonalDetail?.fullName ?? 'Candidato',
          email: currentPersonalDetail?.email ?? 'pendiente@cvpilot.local',
          phone: currentPersonalDetail?.phone ?? undefined,
          location: currentPersonalDetail?.location ?? undefined,
          professionalSummary:
            currentPersonalDetail?.professionalSummary ??
            generatedDocumentContent.improved.summaryText,
        },
        summaryText: generatedDocumentContent.improved.summaryText,
        workExperiences: currentWorkExperiences.map((workExperience) => ({
          companyName: workExperience.companyName,
          jobTitle: workExperience.jobTitle,
          periodLabel: workExperience.periodLabel,
          startDate: workExperience.startDate ?? undefined,
          endDate: workExperience.endDate ?? undefined,
          isCurrent: workExperience.isCurrent,
          description: workExperience.description ?? undefined,
        })),
        educationEntries: currentEducationEntries.map((educationEntry) => ({
          institutionName: educationEntry.institutionName,
          degreeTitle: educationEntry.degreeTitle,
          periodLabel: educationEntry.periodLabel,
          startDate: educationEntry.startDate ?? undefined,
          endDate: educationEntry.endDate ?? undefined,
        })),
        skills: generatedDocumentContent.improved.skills,
      });

      const storedPdf = await this.generatedDocumentsStorageService.storeCvPdf(
        userId,
        generatedPdfBuffer,
      );

      return this.cvsService.createImprovedVersion(userId, request.cvId, {
        targetRole: generatedDocumentContent.improved.targetRole,
        jobDescription: request.jobDescription ?? undefined,
        summaryText: generatedDocumentContent.improved.summaryText,
        skills: generatedDocumentContent.improved.skills,
        skillsText:
          generatedDocumentContent.improved.skillsText ?? undefined,
        stylePreset: CvStylePreset.ATS,
        generatedFileUrl: storedPdf.publicUrl,
        generatedFileFormat: GeneratedFileFormat.PDF,
        createdByProcess: CreatedByProcess.AI,
        improvementRequestId: request.id,
      });
    }

    const fallbackFileName = request.uploadedFile.originalName.replace(/\.[^.]+$/, '');
    const fallbackFullName = fallbackFileName.replaceAll(/[_-]+/g, ' ').trim() || 'Candidato';
    const extractedPersonalDetails = generatedDocumentContent.extracted.personalDetails;
    const extractedSkills = this.normalizeSkills(
      generatedDocumentContent.extracted.skills,
    );

    const baseTargetRole =
      generatedDocumentContent.extracted.extractedTargetRole ?? request.targetRole;

    const generatedPdfBuffer = await this.cvPdfRenderService.renderCvPdf({
      title:
        generatedDocumentContent.extracted.title ?? `CV ${request.targetRole}`,
      targetRole: generatedDocumentContent.improved.targetRole,
      personalDetails: {
        fullName: extractedPersonalDetails.fullName ?? fallbackFullName,
        email: extractedPersonalDetails.email ?? 'pendiente@cvpilot.local',
        phone: extractedPersonalDetails.phone ?? undefined,
        location: extractedPersonalDetails.location ?? undefined,
        professionalSummary:
          extractedPersonalDetails.professionalSummary ??
          generatedDocumentContent.improved.summaryText,
      },
      summaryText: generatedDocumentContent.improved.summaryText,
      workExperiences: generatedDocumentContent.extracted.workExperiences.map(
        (workExperience) => ({
          companyName: workExperience.companyName,
          jobTitle: workExperience.jobTitle,
          periodLabel: workExperience.periodLabel,
          description: workExperience.description ?? undefined,
        }),
      ),
      educationEntries:
        generatedDocumentContent.extracted.educationEntries.map(
          (educationEntry) => ({
            institutionName: educationEntry.institutionName,
            degreeTitle: educationEntry.degreeTitle,
            periodLabel: educationEntry.periodLabel,
          }),
        ),
      skills: generatedDocumentContent.improved.skills,
    });

    const storedPdf = await this.generatedDocumentsStorageService.storeCvPdf(
      userId,
      generatedPdfBuffer,
    );

    const createdCv = await this.cvsService.createInitialCv(userId, {
      title:
        generatedDocumentContent.extracted.title ??
        `CV ${generatedDocumentContent.improved.targetRole}`,
      targetRole: baseTargetRole,
      sourceType: CvSourceType.IMPROVED,
      stylePreset: CvStylePreset.ATS,
      jobDescription: request.jobDescription ?? undefined,
      personalDetails: {
        fullName: extractedPersonalDetails.fullName ?? fallbackFullName,
        email: extractedPersonalDetails.email ?? 'pendiente@cvpilot.local',
        phone: extractedPersonalDetails.phone ?? undefined,
        location: extractedPersonalDetails.location ?? undefined,
        professionalSummary:
          extractedPersonalDetails.professionalSummary ?? undefined,
      },
      workExperiences: generatedDocumentContent.extracted.workExperiences.map(
        (workExperience) => ({
          companyName: workExperience.companyName,
          jobTitle: workExperience.jobTitle,
          periodLabel: workExperience.periodLabel,
          description: workExperience.description ?? undefined,
        }),
      ),
      educationEntries:
        generatedDocumentContent.extracted.educationEntries.map(
          (educationEntry) => ({
            institutionName: educationEntry.institutionName,
            degreeTitle: educationEntry.degreeTitle,
            periodLabel: educationEntry.periodLabel,
          }),
        ),
      skills: extractedSkills,
      skillsText:
        generatedDocumentContent.extracted.skillsText ?? undefined,
    });

    return this.cvsService.createImprovedVersion(userId, createdCv.id, {
      targetRole: generatedDocumentContent.improved.targetRole,
      jobDescription: request.jobDescription ?? undefined,
      summaryText: generatedDocumentContent.improved.summaryText,
      skills: generatedDocumentContent.improved.skills,
      skillsText: generatedDocumentContent.improved.skillsText ?? undefined,
      stylePreset: CvStylePreset.ATS,
      generatedFileUrl: storedPdf.publicUrl,
      generatedFileFormat: GeneratedFileFormat.PDF,
      createdByProcess: CreatedByProcess.AI,
      improvementRequestId: request.id,
      resultSourceType: CvSourceType.IMPROVED,
    });
  }

  async createManualEditedVersion(
    userId: string,
    cvId: string,
    updateManualCvVersionDto: UpdateManualCvVersionDto,
  ) {
    const sourceCv = await this.cvsService.getCv(userId, cvId);
    const currentVersion = sourceCv.currentVersion;

    const currentPersonalDetail = currentVersion?.personalDetail;
    const currentWorkExperiences = currentVersion?.workExperiences ?? [];
    const currentEducationEntries = currentVersion?.educationEntries ?? [];
    const currentSkills = currentVersion?.skills
      .map((versionSkill) => versionSkill.skill?.name)
      .filter((skillName): skillName is string => Boolean(skillName));

    const summaryText =
      updateManualCvVersionDto.summaryText?.trim() ??
      currentVersion?.summaryText ??
      currentPersonalDetail?.professionalSummary ??
      '';

    const skills = this.normalizeSkills(
      updateManualCvVersionDto.skills ?? currentSkills ?? [],
    );

    const generatedPdfBuffer = await this.cvPdfRenderService.renderCvPdf({
      title: updateManualCvVersionDto.title?.trim() ?? sourceCv.title,
      targetRole:
        updateManualCvVersionDto.targetRole?.trim() ?? sourceCv.targetRole,
      personalDetails: {
        fullName:
          updateManualCvVersionDto.personalDetails?.fullName?.trim() ??
          currentPersonalDetail?.fullName ??
          '',
        email:
          updateManualCvVersionDto.personalDetails?.email?.trim() ??
          currentPersonalDetail?.email ??
          '',
        phone:
          updateManualCvVersionDto.personalDetails?.phone?.trim() ??
          currentPersonalDetail?.phone ??
          undefined,
        location:
          updateManualCvVersionDto.personalDetails?.location?.trim() ??
          currentPersonalDetail?.location ??
          undefined,
        professionalSummary:
          updateManualCvVersionDto.personalDetails?.professionalSummary?.trim() ??
          summaryText,
      },
      summaryText,
      workExperiences:
        updateManualCvVersionDto.workExperiences ??
        currentWorkExperiences.map((workExperience) => ({
          companyName: workExperience.companyName,
          jobTitle: workExperience.jobTitle,
          periodLabel: workExperience.periodLabel,
          startDate: workExperience.startDate ?? undefined,
          endDate: workExperience.endDate ?? undefined,
          isCurrent: workExperience.isCurrent,
          description: workExperience.description ?? undefined,
        })),
      educationEntries:
        updateManualCvVersionDto.educationEntries ??
        currentEducationEntries.map((educationEntry) => ({
          institutionName: educationEntry.institutionName,
          degreeTitle: educationEntry.degreeTitle,
          periodLabel: educationEntry.periodLabel,
          startDate: educationEntry.startDate ?? undefined,
          endDate: educationEntry.endDate ?? undefined,
        })),
      skills,
    });

    const storedPdf = await this.generatedDocumentsStorageService.storeCvPdf(
      userId,
      generatedPdfBuffer,
    );

    return this.cvsService.createManualEditedVersion(userId, cvId, {
      ...updateManualCvVersionDto,
      summaryText,
      skills,
      generatedFileUrl: storedPdf.publicUrl,
      generatedFileFormat: GeneratedFileFormat.PDF,
    });
  }

  private normalizeSkills(skills: string[]) {
    return [...new Set(skills.map((skill) => skill.trim()).filter(Boolean))];
  }
}