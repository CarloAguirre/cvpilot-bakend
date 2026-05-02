import { CreatedByProcess, CvSourceType, CvStylePreset, GeneratedFileFormat } from '../../common/enums/database.enums';
import { CreateCvEducationEntryDto, CreateCvWorkExperienceDto } from './create-cv.dto';
export declare class CreateImprovedCvVersionDto {
    targetRole: string;
    jobDescription?: string;
    summaryText?: string;
    skillsText?: string;
    stylePreset?: CvStylePreset;
    generatedFileUrl?: string;
    generatedFileFormat?: GeneratedFileFormat;
    createdByProcess?: CreatedByProcess;
    resultSourceType?: CvSourceType;
    improvementRequestId?: string;
    skills?: string[];
    workExperiences?: CreateCvWorkExperienceDto[];
    educationEntries?: CreateCvEducationEntryDto[];
}
