import { ConfigService } from '@nestjs/config';
import { GenerateCvFromFormDto } from '../dto/generate-cv-from-form.dto';
import { CvPromptBuilderService } from './cv-prompt-builder.service';
export interface GeneratedCvContent {
    targetRole: string;
    summaryText: string;
    skills: string[];
    skillsText: string | null;
}
export interface ExtractedDocumentCvContent {
    title: string | null;
    extractedTargetRole: string | null;
    personalDetails: {
        fullName: string | null;
        email: string | null;
        phone: string | null;
        location: string | null;
        professionalSummary: string | null;
    };
    workExperiences: Array<{
        companyName: string;
        jobTitle: string;
        periodLabel: string;
        description: string | null;
    }>;
    educationEntries: Array<{
        institutionName: string;
        degreeTitle: string;
        periodLabel: string;
    }>;
    skills: string[];
    skillsText: string | null;
}
export interface ImprovedDocumentCvContent {
    targetRole: string;
    summaryText: string;
    skills: string[];
    skillsText: string | null;
}
export interface GeneratedDocumentImprovementContent {
    extracted: ExtractedDocumentCvContent;
    improved: ImprovedDocumentCvContent;
}
interface GenerateFromUploadedDocumentInput {
    originalFileName: string;
    targetRole: string;
    jobDescription?: string | null;
    extractedText: string;
}
export declare class OpenAiCvGeneratorService {
    private readonly configService;
    private readonly cvPromptBuilderService;
    private readonly logger;
    constructor(configService: ConfigService, cvPromptBuilderService: CvPromptBuilderService);
    generateFromForm(generateCvFromFormDto: GenerateCvFromFormDto): Promise<GeneratedCvContent>;
    generateFromUploadedDocument(input: GenerateFromUploadedDocumentInput): Promise<GeneratedDocumentImprovementContent>;
    private createClient;
    private getProviderConfig;
    private inferProviderId;
    private readConfigValue;
    private readRequiredConfig;
    private formatProviderName;
    private parseGeneratedContent;
    private parseUploadedDocumentContent;
    private parseJsonPayload;
    private readObject;
    private readObjectArray;
    private readString;
    private readStringArray;
    private splitSkillsText;
    private normalizeSkills;
    private handleProviderError;
}
export {};
