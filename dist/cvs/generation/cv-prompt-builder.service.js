"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CvPromptBuilderService = void 0;
const common_1 = require("@nestjs/common");
let CvPromptBuilderService = class CvPromptBuilderService {
    buildSystemPrompt() {
        return [
            'You are an expert ATS resume writer.',
            'Return only valid JSON without markdown or code fences.',
            'Keep the writing professional, concise, and aligned to the target role.',
            'Do not invent employers, dates, degrees, or certifications that are not present in the input.',
            'Respond with a JSON object that contains exactly these keys: targetRole, summaryText, skills, skillsText, workExperiences, educationEntries.',
            'targetRole must be a string.',
            'summaryText must be a string with 2 to 4 sentences.',
            'skills must be an array of 6 to 12 short strings when enough information exists.',
            'skillsText must be a comma-separated string derived from skills.',
            'workExperiences must be an array with the same length and order as the input workExperiences array.',
            'Each workExperiences item must contain exactly: companyName, jobTitle, periodLabel, startDate, endDate, isCurrent, description.',
            'Preserve companyName, jobTitle, periodLabel, startDate, endDate, and isCurrent from the input. You may only improve description when a factual description already exists. If it does not exist, return null.',
            'educationEntries must be an array with the same length and order as the input educationEntries array.',
            'Each educationEntries item must contain exactly: institutionName, degreeTitle, periodLabel, startDate, endDate.',
            'Preserve institutionName, periodLabel, startDate, and endDate from the input. You may lightly normalize degreeTitle wording for clarity, but do not add new credentials.',
            'Preserve the input language unless the user explicitly asks for another one.',
        ].join('\n');
    }
    buildUserPrompt(generateCvFromFormDto) {
        return JSON.stringify({
            title: generateCvFromFormDto.title ?? null,
            targetRole: generateCvFromFormDto.targetRole,
            stylePreset: generateCvFromFormDto.stylePreset ?? 'ats',
            jobDescription: generateCvFromFormDto.jobDescription ?? null,
            generationInstructions: generateCvFromFormDto.generationInstructions ?? null,
            personalDetails: {
                fullName: generateCvFromFormDto.personalDetails.fullName,
                location: generateCvFromFormDto.personalDetails.location ?? null,
                professionalSummary: generateCvFromFormDto.personalDetails.professionalSummary ?? null,
            },
            workExperiences: generateCvFromFormDto.workExperiences ?? [],
            educationEntries: generateCvFromFormDto.educationEntries ?? [],
            skills: generateCvFromFormDto.skills ?? [],
            skillsText: generateCvFromFormDto.skillsText ?? null,
        }, null, 2);
    }
    buildUploadedDocumentSystemPrompt() {
        return [
            'You are an expert ATS resume analyst and writer.',
            'Return only valid JSON without markdown or code fences.',
            'Do not invent employers, dates, degrees, certifications, or contact data that are not present in the document.',
            'If a field is missing, return null for scalar fields or [] for arrays.',
            'Use the same language as the source document.',
            'Respond with a JSON object that contains exactly these keys:',
            'title, extractedTargetRole, personalDetails, workExperiences, educationEntries, skills, skillsText, improvedTargetRole, improvedSummaryText, improvedSkills, improvedSkillsText.',
            'personalDetails must contain: fullName, email, phone, location, professionalSummary.',
            'workExperiences must be an array of objects with: companyName, jobTitle, periodLabel, description.',
            'educationEntries must be an array of objects with: institutionName, degreeTitle, periodLabel.',
            'skills and improvedSkills must be arrays of short strings.',
            'skillsText and improvedSkillsText must be comma-separated strings derived from the corresponding skills arrays.',
            'improvedTargetRole must align to the requested target role when one is provided.',
            'improvedSummaryText must be 2 to 4 sentences and stronger than the original summary.',
        ].join('\n');
    }
    buildUploadedDocumentUserPrompt(input) {
        return JSON.stringify({
            originalFileName: input.originalFileName,
            targetRole: input.targetRole,
            jobDescription: input.jobDescription ?? null,
            extractedText: input.extractedText,
        }, null, 2);
    }
};
exports.CvPromptBuilderService = CvPromptBuilderService;
exports.CvPromptBuilderService = CvPromptBuilderService = __decorate([
    (0, common_1.Injectable)()
], CvPromptBuilderService);
//# sourceMappingURL=cv-prompt-builder.service.js.map