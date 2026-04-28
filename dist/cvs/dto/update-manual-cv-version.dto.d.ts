import { CvStylePreset, GeneratedFileFormat } from '../../common/enums/database.enums';
export declare class ManualEditCvPersonalDetailsDto {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    professionalSummary?: string;
}
export declare class ManualEditCvWorkExperienceDto {
    companyName: string;
    jobTitle: string;
    periodLabel: string;
    startDate?: string;
    endDate?: string;
    isCurrent?: boolean;
    description?: string;
}
export declare class ManualEditCvEducationEntryDto {
    institutionName: string;
    degreeTitle: string;
    periodLabel: string;
    startDate?: string;
    endDate?: string;
}
export declare class UpdateManualCvVersionDto {
    title?: string;
    targetRole?: string;
    jobDescription?: string;
    summaryText?: string;
    skillsText?: string;
    stylePreset?: CvStylePreset;
    generatedFileUrl?: string;
    generatedFileFormat?: GeneratedFileFormat;
    personalDetails?: ManualEditCvPersonalDetailsDto;
    workExperiences?: ManualEditCvWorkExperienceDto[];
    educationEntries?: ManualEditCvEducationEntryDto[];
    skills?: string[];
}
