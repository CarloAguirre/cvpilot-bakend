import { GenerateCvFromFormDto } from '../dto/generate-cv-from-form.dto';
interface BuildUploadedDocumentPromptInput {
    originalFileName: string;
    targetRole: string;
    jobDescription?: string | null;
    extractedText: string;
}
export declare class CvPromptBuilderService {
    buildSystemPrompt(): string;
    buildUserPrompt(generateCvFromFormDto: GenerateCvFromFormDto): string;
    buildUploadedDocumentSystemPrompt(): string;
    buildUploadedDocumentUserPrompt(input: BuildUploadedDocumentPromptInput): string;
}
export {};
