import { CreatedByProcess, GeneratedFileFormat } from '../../common/enums/database.enums';
export declare class CreateImprovedCvVersionDto {
    targetRole: string;
    jobDescription?: string;
    summaryText?: string;
    skillsText?: string;
    generatedFileUrl?: string;
    generatedFileFormat?: GeneratedFileFormat;
    createdByProcess?: CreatedByProcess;
    improvementRequestId?: string;
    skills?: string[];
}
