import { CvSourceType } from '../../common/enums/database.enums';
export declare class CreateCvPersonalDetailsDto {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    professionalSummary?: string;
}
export declare class CreateCvWorkExperienceDto {
    companyName: string;
    jobTitle: string;
    periodLabel: string;
    startDate?: string;
    endDate?: string;
    isCurrent?: boolean;
    description?: string;
}
export declare class CreateCvEducationEntryDto {
    institutionName: string;
    degreeTitle: string;
    periodLabel: string;
    startDate?: string;
    endDate?: string;
}
export declare class CreateCvDto {
    title?: string;
    targetRole: string;
    sourceType?: CvSourceType;
    jobDescription?: string;
    personalDetails: CreateCvPersonalDetailsDto;
    workExperiences?: CreateCvWorkExperienceDto[];
    educationEntries?: CreateCvEducationEntryDto[];
    skills?: string[];
    skillsText?: string;
}
