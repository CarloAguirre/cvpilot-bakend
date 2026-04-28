"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CvGenerationWorkflowService = void 0;
const common_1 = require("@nestjs/common");
const database_enums_1 = require("../../common/enums/database.enums");
const cvs_service_1 = require("../cvs.service");
const cv_document_text_extractor_service_1 = require("./cv-document-text-extractor.service");
const cv_pdf_render_service_1 = require("./cv-pdf-render.service");
const generated_documents_storage_service_1 = require("./generated-documents-storage.service");
const openai_cv_generator_service_1 = require("./openai-cv-generator.service");
let CvGenerationWorkflowService = class CvGenerationWorkflowService {
    cvsService;
    cvDocumentTextExtractorService;
    cvPdfRenderService;
    generatedDocumentsStorageService;
    openAiCvGeneratorService;
    constructor(cvsService, cvDocumentTextExtractorService, cvPdfRenderService, generatedDocumentsStorageService, openAiCvGeneratorService) {
        this.cvsService = cvsService;
        this.cvDocumentTextExtractorService = cvDocumentTextExtractorService;
        this.cvPdfRenderService = cvPdfRenderService;
        this.generatedDocumentsStorageService = generatedDocumentsStorageService;
        this.openAiCvGeneratorService = openAiCvGeneratorService;
    }
    async generateFromForm(userId, generateCvFromFormDto) {
        const generatedContent = await this.openAiCvGeneratorService.generateFromForm(generateCvFromFormDto);
        const generatedPdfBuffer = await this.cvPdfRenderService.renderCvPdf({
            title: generateCvFromFormDto.title ?? null,
            targetRole: generatedContent.targetRole,
            personalDetails: generateCvFromFormDto.personalDetails,
            summaryText: generatedContent.summaryText,
            workExperiences: generateCvFromFormDto.workExperiences ?? [],
            educationEntries: generateCvFromFormDto.educationEntries ?? [],
            skills: generatedContent.skills,
        });
        const storedPdf = await this.generatedDocumentsStorageService.storeCvPdf(userId, generatedPdfBuffer);
        const createdCv = await this.cvsService.createInitialCv(userId, {
            title: generateCvFromFormDto.title,
            targetRole: generateCvFromFormDto.targetRole,
            sourceType: database_enums_1.CvSourceType.CREATED,
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
            generatedFileFormat: database_enums_1.GeneratedFileFormat.PDF,
            createdByProcess: database_enums_1.CreatedByProcess.AI,
            resultSourceType: database_enums_1.CvSourceType.CREATED,
        });
    }
    async processImprovementRequest(userId, request) {
        if (!request.uploadedFile) {
            throw new Error('Improvement request is missing the uploaded file relation');
        }
        const extractedText = await this.cvDocumentTextExtractorService.extractText(request.uploadedFile.storagePath, request.uploadedFile.fileExtension);
        const generatedDocumentContent = await this.openAiCvGeneratorService.generateFromUploadedDocument({
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
                    professionalSummary: currentPersonalDetail?.professionalSummary ??
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
            const storedPdf = await this.generatedDocumentsStorageService.storeCvPdf(userId, generatedPdfBuffer);
            return this.cvsService.createImprovedVersion(userId, request.cvId, {
                targetRole: generatedDocumentContent.improved.targetRole,
                jobDescription: request.jobDescription ?? undefined,
                summaryText: generatedDocumentContent.improved.summaryText,
                skills: generatedDocumentContent.improved.skills,
                skillsText: generatedDocumentContent.improved.skillsText ?? undefined,
                stylePreset: database_enums_1.CvStylePreset.ATS,
                generatedFileUrl: storedPdf.publicUrl,
                generatedFileFormat: database_enums_1.GeneratedFileFormat.PDF,
                createdByProcess: database_enums_1.CreatedByProcess.AI,
                improvementRequestId: request.id,
            });
        }
        const fallbackFileName = request.uploadedFile.originalName.replace(/\.[^.]+$/, '');
        const fallbackFullName = fallbackFileName.replaceAll(/[_-]+/g, ' ').trim() || 'Candidato';
        const extractedPersonalDetails = generatedDocumentContent.extracted.personalDetails;
        const extractedSkills = this.normalizeSkills(generatedDocumentContent.extracted.skills);
        const baseTargetRole = generatedDocumentContent.extracted.extractedTargetRole ?? request.targetRole;
        const generatedPdfBuffer = await this.cvPdfRenderService.renderCvPdf({
            title: generatedDocumentContent.extracted.title ?? `CV ${request.targetRole}`,
            targetRole: generatedDocumentContent.improved.targetRole,
            personalDetails: {
                fullName: extractedPersonalDetails.fullName ?? fallbackFullName,
                email: extractedPersonalDetails.email ?? 'pendiente@cvpilot.local',
                phone: extractedPersonalDetails.phone ?? undefined,
                location: extractedPersonalDetails.location ?? undefined,
                professionalSummary: extractedPersonalDetails.professionalSummary ??
                    generatedDocumentContent.improved.summaryText,
            },
            summaryText: generatedDocumentContent.improved.summaryText,
            workExperiences: generatedDocumentContent.extracted.workExperiences.map((workExperience) => ({
                companyName: workExperience.companyName,
                jobTitle: workExperience.jobTitle,
                periodLabel: workExperience.periodLabel,
                description: workExperience.description ?? undefined,
            })),
            educationEntries: generatedDocumentContent.extracted.educationEntries.map((educationEntry) => ({
                institutionName: educationEntry.institutionName,
                degreeTitle: educationEntry.degreeTitle,
                periodLabel: educationEntry.periodLabel,
            })),
            skills: generatedDocumentContent.improved.skills,
        });
        const storedPdf = await this.generatedDocumentsStorageService.storeCvPdf(userId, generatedPdfBuffer);
        const createdCv = await this.cvsService.createInitialCv(userId, {
            title: generatedDocumentContent.extracted.title ??
                `CV ${generatedDocumentContent.improved.targetRole}`,
            targetRole: baseTargetRole,
            sourceType: database_enums_1.CvSourceType.IMPROVED,
            stylePreset: database_enums_1.CvStylePreset.ATS,
            jobDescription: request.jobDescription ?? undefined,
            personalDetails: {
                fullName: extractedPersonalDetails.fullName ?? fallbackFullName,
                email: extractedPersonalDetails.email ?? 'pendiente@cvpilot.local',
                phone: extractedPersonalDetails.phone ?? undefined,
                location: extractedPersonalDetails.location ?? undefined,
                professionalSummary: extractedPersonalDetails.professionalSummary ?? undefined,
            },
            workExperiences: generatedDocumentContent.extracted.workExperiences.map((workExperience) => ({
                companyName: workExperience.companyName,
                jobTitle: workExperience.jobTitle,
                periodLabel: workExperience.periodLabel,
                description: workExperience.description ?? undefined,
            })),
            educationEntries: generatedDocumentContent.extracted.educationEntries.map((educationEntry) => ({
                institutionName: educationEntry.institutionName,
                degreeTitle: educationEntry.degreeTitle,
                periodLabel: educationEntry.periodLabel,
            })),
            skills: extractedSkills,
            skillsText: generatedDocumentContent.extracted.skillsText ?? undefined,
        });
        return this.cvsService.createImprovedVersion(userId, createdCv.id, {
            targetRole: generatedDocumentContent.improved.targetRole,
            jobDescription: request.jobDescription ?? undefined,
            summaryText: generatedDocumentContent.improved.summaryText,
            skills: generatedDocumentContent.improved.skills,
            skillsText: generatedDocumentContent.improved.skillsText ?? undefined,
            stylePreset: database_enums_1.CvStylePreset.ATS,
            generatedFileUrl: storedPdf.publicUrl,
            generatedFileFormat: database_enums_1.GeneratedFileFormat.PDF,
            createdByProcess: database_enums_1.CreatedByProcess.AI,
            improvementRequestId: request.id,
            resultSourceType: database_enums_1.CvSourceType.IMPROVED,
        });
    }
    async createManualEditedVersion(userId, cvId, updateManualCvVersionDto) {
        const sourceCv = await this.cvsService.getCv(userId, cvId);
        const currentVersion = sourceCv.currentVersion;
        const currentPersonalDetail = currentVersion?.personalDetail;
        const currentWorkExperiences = currentVersion?.workExperiences ?? [];
        const currentEducationEntries = currentVersion?.educationEntries ?? [];
        const currentSkills = currentVersion?.skills
            .map((versionSkill) => versionSkill.skill?.name)
            .filter((skillName) => Boolean(skillName));
        const summaryText = updateManualCvVersionDto.summaryText?.trim() ??
            currentVersion?.summaryText ??
            currentPersonalDetail?.professionalSummary ??
            '';
        const skills = this.normalizeSkills(updateManualCvVersionDto.skills ?? currentSkills ?? []);
        const generatedPdfBuffer = await this.cvPdfRenderService.renderCvPdf({
            title: updateManualCvVersionDto.title?.trim() ?? sourceCv.title,
            targetRole: updateManualCvVersionDto.targetRole?.trim() ?? sourceCv.targetRole,
            personalDetails: {
                fullName: updateManualCvVersionDto.personalDetails?.fullName?.trim() ??
                    currentPersonalDetail?.fullName ??
                    '',
                email: updateManualCvVersionDto.personalDetails?.email?.trim() ??
                    currentPersonalDetail?.email ??
                    '',
                phone: updateManualCvVersionDto.personalDetails?.phone?.trim() ??
                    currentPersonalDetail?.phone ??
                    undefined,
                location: updateManualCvVersionDto.personalDetails?.location?.trim() ??
                    currentPersonalDetail?.location ??
                    undefined,
                professionalSummary: updateManualCvVersionDto.personalDetails?.professionalSummary?.trim() ??
                    summaryText,
            },
            summaryText,
            workExperiences: updateManualCvVersionDto.workExperiences ??
                currentWorkExperiences.map((workExperience) => ({
                    companyName: workExperience.companyName,
                    jobTitle: workExperience.jobTitle,
                    periodLabel: workExperience.periodLabel,
                    startDate: workExperience.startDate ?? undefined,
                    endDate: workExperience.endDate ?? undefined,
                    isCurrent: workExperience.isCurrent,
                    description: workExperience.description ?? undefined,
                })),
            educationEntries: updateManualCvVersionDto.educationEntries ??
                currentEducationEntries.map((educationEntry) => ({
                    institutionName: educationEntry.institutionName,
                    degreeTitle: educationEntry.degreeTitle,
                    periodLabel: educationEntry.periodLabel,
                    startDate: educationEntry.startDate ?? undefined,
                    endDate: educationEntry.endDate ?? undefined,
                })),
            skills,
        });
        const storedPdf = await this.generatedDocumentsStorageService.storeCvPdf(userId, generatedPdfBuffer);
        return this.cvsService.createManualEditedVersion(userId, cvId, {
            ...updateManualCvVersionDto,
            summaryText,
            skills,
            generatedFileUrl: storedPdf.publicUrl,
            generatedFileFormat: database_enums_1.GeneratedFileFormat.PDF,
        });
    }
    normalizeSkills(skills) {
        return [...new Set(skills.map((skill) => skill.trim()).filter(Boolean))];
    }
};
exports.CvGenerationWorkflowService = CvGenerationWorkflowService;
exports.CvGenerationWorkflowService = CvGenerationWorkflowService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cvs_service_1.CvsService,
        cv_document_text_extractor_service_1.CvDocumentTextExtractorService,
        cv_pdf_render_service_1.CvPdfRenderService,
        generated_documents_storage_service_1.GeneratedDocumentsStorageService,
        openai_cv_generator_service_1.OpenAiCvGeneratorService])
], CvGenerationWorkflowService);
//# sourceMappingURL=cv-generation-workflow.service.js.map