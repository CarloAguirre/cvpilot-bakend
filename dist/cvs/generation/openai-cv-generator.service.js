"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var OpenAiCvGeneratorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAiCvGeneratorService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = __importStar(require("openai"));
const cv_prompt_builder_service_1 = require("./cv-prompt-builder.service");
let OpenAiCvGeneratorService = OpenAiCvGeneratorService_1 = class OpenAiCvGeneratorService {
    configService;
    cvPromptBuilderService;
    logger = new common_1.Logger(OpenAiCvGeneratorService_1.name);
    constructor(configService, cvPromptBuilderService) {
        this.configService = configService;
        this.cvPromptBuilderService = cvPromptBuilderService;
    }
    async generateFromForm(generateCvFromFormDto) {
        const providerConfig = this.getProviderConfig();
        const client = this.createClient(providerConfig);
        try {
            const completion = await client.chat.completions.create({
                model: providerConfig.model,
                temperature: 0.3,
                response_format: { type: 'json_object' },
                messages: [
                    {
                        role: 'system',
                        content: this.cvPromptBuilderService.buildSystemPrompt(),
                    },
                    {
                        role: 'user',
                        content: this.cvPromptBuilderService.buildUserPrompt(generateCvFromFormDto),
                    },
                ],
            });
            return this.parseGeneratedContent(completion.choices[0]?.message?.content, generateCvFromFormDto);
        }
        catch (error) {
            this.handleProviderError(error, providerConfig);
        }
    }
    async generateFromUploadedDocument(input) {
        const providerConfig = this.getProviderConfig();
        const client = this.createClient(providerConfig);
        try {
            const completion = await client.chat.completions.create({
                model: providerConfig.model,
                temperature: 0.2,
                response_format: { type: 'json_object' },
                messages: [
                    {
                        role: 'system',
                        content: this.cvPromptBuilderService.buildUploadedDocumentSystemPrompt(),
                    },
                    {
                        role: 'user',
                        content: this.cvPromptBuilderService.buildUploadedDocumentUserPrompt(input),
                    },
                ],
            });
            return this.parseUploadedDocumentContent(completion.choices[0]?.message?.content, input);
        }
        catch (error) {
            this.handleProviderError(error, providerConfig);
        }
    }
    createClient(providerConfig) {
        return new openai_1.default({
            apiKey: providerConfig.apiKey,
            ...(providerConfig.baseURL
                ? { baseURL: providerConfig.baseURL }
                : {}),
        });
    }
    getProviderConfig() {
        const providerId = this.readConfigValue('LLM_PROVIDER')?.toLowerCase() ||
            this.inferProviderId();
        if (providerId === 'gemini') {
            return {
                providerName: 'Gemini',
                apiKey: this.readRequiredConfig(['LLM_API_KEY', 'GEMINI_API_KEY'], 'LLM_API_KEY or GEMINI_API_KEY'),
                apiKeyHint: 'LLM_API_KEY or GEMINI_API_KEY',
                baseURL: this.readConfigValue('LLM_BASE_URL') ||
                    this.readConfigValue('GEMINI_BASE_URL') ||
                    'https://generativelanguage.googleapis.com/v1beta/openai/',
                model: this.readConfigValue('LLM_MODEL') ||
                    this.readConfigValue('GEMINI_MODEL') ||
                    'gemini-2.5-flash',
            };
        }
        if (providerId === 'openai') {
            return {
                providerName: 'OpenAI',
                apiKey: this.readRequiredConfig(['LLM_API_KEY', 'OPENAI_API_KEY'], 'LLM_API_KEY or OPENAI_API_KEY'),
                apiKeyHint: 'LLM_API_KEY or OPENAI_API_KEY',
                baseURL: this.readConfigValue('LLM_BASE_URL') ||
                    this.readConfigValue('OPENAI_BASE_URL') ||
                    undefined,
                model: this.readConfigValue('LLM_MODEL') ||
                    this.readConfigValue('OPENAI_MODEL') ||
                    'gpt-4.1-mini',
            };
        }
        const providerName = this.formatProviderName(providerId);
        const baseURL = this.readConfigValue('LLM_BASE_URL');
        if (!baseURL) {
            throw new common_1.ServiceUnavailableException(`LLM_BASE_URL is not configured for provider ${providerName}`);
        }
        return {
            providerName,
            apiKey: this.readRequiredConfig(['LLM_API_KEY'], 'LLM_API_KEY'),
            apiKeyHint: 'LLM_API_KEY',
            baseURL,
            model: this.readConfigValue('LLM_MODEL') || 'gemini-2.5-flash',
        };
    }
    inferProviderId() {
        if (this.readConfigValue('GEMINI_API_KEY')) {
            return 'gemini';
        }
        if (this.readConfigValue('OPENAI_API_KEY')) {
            return 'openai';
        }
        return 'gemini';
    }
    readConfigValue(key) {
        const value = this.configService.get(key)?.trim();
        return value?.length ? value : null;
    }
    readRequiredConfig(keys, hint) {
        for (const key of keys) {
            const value = this.readConfigValue(key);
            if (value) {
                return value;
            }
        }
        throw new common_1.ServiceUnavailableException(`${hint} is not configured`);
    }
    formatProviderName(providerId) {
        if (!providerId.length) {
            return 'configured LLM provider';
        }
        return providerId.charAt(0).toUpperCase() + providerId.slice(1);
    }
    parseGeneratedContent(rawContent, generateCvFromFormDto) {
        const parsedContent = this.parseJsonPayload(rawContent);
        const targetRole = this.readString(parsedContent, 'targetRole') ||
            generateCvFromFormDto.targetRole;
        const summaryText = this.readString(parsedContent, 'summaryText') ||
            generateCvFromFormDto.personalDetails.professionalSummary?.trim() ||
            null;
        if (!summaryText) {
            throw new common_1.ServiceUnavailableException('LLM response did not include summaryText');
        }
        const generatedSkills = this.readStringArray(parsedContent, 'skills');
        const fallbackSkills = this.normalizeSkills([
            ...(generateCvFromFormDto.skills ?? []),
            ...this.splitSkillsText(generateCvFromFormDto.skillsText),
        ]);
        const skills = generatedSkills.length ? generatedSkills : fallbackSkills;
        const skillsText = this.readString(parsedContent, 'skillsText') ||
            (skills.length ? skills.join(', ') : null);
        const workExperiences = this.mergeGeneratedWorkExperiences(parsedContent, generateCvFromFormDto.workExperiences ?? []);
        const educationEntries = this.mergeGeneratedEducationEntries(parsedContent, generateCvFromFormDto.educationEntries ?? []);
        return {
            targetRole,
            summaryText,
            skills,
            skillsText,
            workExperiences,
            educationEntries,
        };
    }
    mergeGeneratedWorkExperiences(payload, sourceWorkExperiences) {
        const generatedEntries = this.readObjectArray(payload, 'workExperiences');
        return sourceWorkExperiences.map((workExperience, index) => {
            const generatedEntry = generatedEntries[index] ?? {};
            const normalizedDescription = this.readString(generatedEntry, 'description') ??
                workExperience.description?.trim() ??
                undefined;
            return {
                companyName: this.readString(generatedEntry, 'companyName') ??
                    workExperience.companyName.trim(),
                jobTitle: this.readString(generatedEntry, 'jobTitle') ??
                    workExperience.jobTitle.trim(),
                periodLabel: this.readString(generatedEntry, 'periodLabel') ??
                    workExperience.periodLabel.trim(),
                startDate: this.readString(generatedEntry, 'startDate') ??
                    workExperience.startDate?.trim(),
                endDate: this.readString(generatedEntry, 'endDate') ??
                    workExperience.endDate?.trim(),
                isCurrent: this.readBoolean(generatedEntry, 'isCurrent') ??
                    workExperience.isCurrent ??
                    false,
                ...(normalizedDescription
                    ? { description: normalizedDescription }
                    : {}),
            };
        });
    }
    mergeGeneratedEducationEntries(payload, sourceEducationEntries) {
        const generatedEntries = this.readObjectArray(payload, 'educationEntries');
        return sourceEducationEntries.map((educationEntry, index) => {
            const generatedEntry = generatedEntries[index] ?? {};
            return {
                institutionName: this.readString(generatedEntry, 'institutionName') ??
                    educationEntry.institutionName.trim(),
                degreeTitle: this.readString(generatedEntry, 'degreeTitle') ??
                    educationEntry.degreeTitle.trim(),
                periodLabel: this.readString(generatedEntry, 'periodLabel') ??
                    educationEntry.periodLabel.trim(),
                startDate: this.readString(generatedEntry, 'startDate') ??
                    educationEntry.startDate?.trim(),
                endDate: this.readString(generatedEntry, 'endDate') ??
                    educationEntry.endDate?.trim(),
            };
        });
    }
    parseUploadedDocumentContent(rawContent, input) {
        const parsedContent = this.parseJsonPayload(rawContent);
        const extractedPersonalDetails = this.readObject(parsedContent, 'personalDetails');
        const extractedSkills = this.readStringArray(parsedContent, 'skills');
        const improvedSkills = this.readStringArray(parsedContent, 'improvedSkills');
        return {
            extracted: {
                title: this.readString(parsedContent, 'title'),
                extractedTargetRole: this.readString(parsedContent, 'extractedTargetRole'),
                personalDetails: {
                    fullName: this.readString(extractedPersonalDetails, 'fullName'),
                    email: this.readString(extractedPersonalDetails, 'email'),
                    phone: this.readString(extractedPersonalDetails, 'phone'),
                    location: this.readString(extractedPersonalDetails, 'location'),
                    professionalSummary: this.readString(extractedPersonalDetails, 'professionalSummary'),
                },
                workExperiences: this.readObjectArray(parsedContent, 'workExperiences')
                    .map((entry) => ({
                    companyName: this.readString(entry, 'companyName'),
                    jobTitle: this.readString(entry, 'jobTitle'),
                    periodLabel: this.readString(entry, 'periodLabel'),
                    description: this.readString(entry, 'description'),
                }))
                    .filter((entry) => Boolean(entry.companyName) &&
                    Boolean(entry.jobTitle) &&
                    Boolean(entry.periodLabel)),
                educationEntries: this.readObjectArray(parsedContent, 'educationEntries')
                    .map((entry) => ({
                    institutionName: this.readString(entry, 'institutionName'),
                    degreeTitle: this.readString(entry, 'degreeTitle'),
                    periodLabel: this.readString(entry, 'periodLabel'),
                }))
                    .filter((entry) => Boolean(entry.institutionName) &&
                    Boolean(entry.degreeTitle) &&
                    Boolean(entry.periodLabel)),
                skills: extractedSkills,
                skillsText: this.readString(parsedContent, 'skillsText') ||
                    (extractedSkills.length ? extractedSkills.join(', ') : null),
            },
            improved: {
                targetRole: this.readString(parsedContent, 'improvedTargetRole') || input.targetRole,
                summaryText: this.readString(parsedContent, 'improvedSummaryText') ||
                    this.readString(parsedContent, 'summaryText') ||
                    this.readString(extractedPersonalDetails, 'professionalSummary') ||
                    'Perfil profesional pendiente de completar.',
                skills: improvedSkills.length ? improvedSkills : extractedSkills,
                skillsText: this.readString(parsedContent, 'improvedSkillsText') ||
                    (improvedSkills.length
                        ? improvedSkills.join(', ')
                        : extractedSkills.length
                            ? extractedSkills.join(', ')
                            : null),
            },
        };
    }
    parseJsonPayload(rawContent) {
        if (!rawContent?.trim()) {
            throw new common_1.ServiceUnavailableException('LLM returned an empty response');
        }
        let parsedContent;
        try {
            parsedContent = JSON.parse(rawContent);
        }
        catch {
            throw new common_1.ServiceUnavailableException('LLM returned invalid JSON');
        }
        if (!parsedContent ||
            typeof parsedContent !== 'object' ||
            Array.isArray(parsedContent)) {
            throw new common_1.ServiceUnavailableException('LLM returned an unexpected payload');
        }
        return parsedContent;
    }
    readObject(payload, key) {
        const candidate = payload[key];
        if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
            return {};
        }
        return candidate;
    }
    readObjectArray(payload, key) {
        const candidate = payload[key];
        if (!Array.isArray(candidate)) {
            return [];
        }
        return candidate.filter((entry) => Boolean(entry) && typeof entry === 'object' && !Array.isArray(entry));
    }
    readString(payload, key) {
        const candidate = payload[key];
        if (typeof candidate !== 'string') {
            return null;
        }
        const normalizedCandidate = candidate.trim();
        return normalizedCandidate.length ? normalizedCandidate : null;
    }
    readBoolean(payload, key) {
        const candidate = payload[key];
        return typeof candidate === 'boolean' ? candidate : null;
    }
    readStringArray(payload, key) {
        const candidate = payload[key];
        if (!Array.isArray(candidate)) {
            return [];
        }
        return this.normalizeSkills(candidate.filter((value) => typeof value === 'string'));
    }
    splitSkillsText(skillsText) {
        return (skillsText ?? '')
            .split(',')
            .map((skill) => skill.trim())
            .filter(Boolean);
    }
    normalizeSkills(skills) {
        return [...new Set(skills.map((skill) => skill.trim()).filter(Boolean))];
    }
    handleProviderError(error, providerConfig) {
        const providerName = providerConfig.providerName;
        if (error instanceof openai_1.RateLimitError) {
            const requestIdSuffix = error.requestID
                ? ` requestId=${error.requestID}`
                : '';
            if (error.code === 'insufficient_quota' || error.type === 'insufficient_quota') {
                this.logger.warn(`${providerName} quota exceeded.${requestIdSuffix}`);
                throw new common_1.ServiceUnavailableException(`${providerName} quota exceeded for the configured API key. Check billing/quota or replace ${providerConfig.apiKeyHint}.`);
            }
            this.logger.warn(`${providerName} rate limit reached.${requestIdSuffix}`);
            throw new common_1.HttpException(`${providerName} rate limit reached. Retry in a few moments.`, common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        if (error instanceof openai_1.APIConnectionTimeoutError ||
            error instanceof openai_1.APIConnectionError) {
            this.logger.error(`${providerName} connection failed.`, error);
            throw new common_1.ServiceUnavailableException(`Could not reach ${providerName}. Retry in a few moments.`);
        }
        if (error instanceof openai_1.APIError) {
            this.logger.error(`${providerName} request failed with status ${error.status ?? 'unknown'}.`);
            throw new common_1.ServiceUnavailableException(`${providerName} request failed. Check the configured API key and try again.`);
        }
        throw error;
    }
};
exports.OpenAiCvGeneratorService = OpenAiCvGeneratorService;
exports.OpenAiCvGeneratorService = OpenAiCvGeneratorService = OpenAiCvGeneratorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        cv_prompt_builder_service_1.CvPromptBuilderService])
], OpenAiCvGeneratorService);
//# sourceMappingURL=openai-cv-generator.service.js.map