import { ConfigService } from '@nestjs/config';
import { CreateCvEducationEntryDto, CreateCvPersonalDetailsDto, CreateCvWorkExperienceDto } from '../dto/create-cv.dto';
interface RenderCvPdfInput {
    title: string | null;
    targetRole: string;
    personalDetails: CreateCvPersonalDetailsDto;
    summaryText: string;
    workExperiences: CreateCvWorkExperienceDto[];
    educationEntries: CreateCvEducationEntryDto[];
    skills: string[];
}
export declare class CvPdfRenderService {
    private readonly configService;
    constructor(configService: ConfigService);
    renderCvPdf(input: RenderCvPdfInput): Promise<Buffer<ArrayBuffer>>;
    private buildHtml;
    private escapeHtml;
}
export {};
