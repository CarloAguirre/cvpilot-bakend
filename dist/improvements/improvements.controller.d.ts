import { CreateCvImprovementRequestDto } from './dto/create-cv-improvement-request.dto';
import { UpdateCvImprovementRequestDto } from './dto/update-cv-improvement-request.dto';
import { ImprovementsService } from './improvements.service';
export declare class ImprovementsController {
    private readonly improvementsService;
    constructor(improvementsService: ImprovementsService);
    listRequests(userId: string): Promise<{
        id: string;
        userId: string;
        cvId: string | null;
        uploadedFileId: string;
        targetRole: string;
        jobDescription: string | null;
        status: import("../common/enums/database.enums").CvImprovementRequestStatus;
        errorMessage: string | null;
        resultCvVersionId: string | null;
        cv: {
            id: string;
            title: string | null;
            targetRole: string;
            currentVersionId: string | null;
            isArchived: boolean;
        } | null;
        uploadedFile: {
            id: string;
            originalName: string;
            mimeType: string;
            fileExtension: string;
            fileSizeBytes: number;
            storagePath: string;
            createdAt: Date;
        } | null;
        resultCvVersion: {
            id: string;
            versionNumber: number;
            versionType: import("../common/enums/database.enums").CvVersionType;
            targetRole: string;
            isCurrent: boolean;
            createdAt: Date;
        } | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createRequest(userId: string, createCvImprovementRequestDto: CreateCvImprovementRequestDto): Promise<{
        id: string;
        userId: string;
        cvId: string | null;
        uploadedFileId: string;
        targetRole: string;
        jobDescription: string | null;
        status: import("../common/enums/database.enums").CvImprovementRequestStatus;
        errorMessage: string | null;
        resultCvVersionId: string | null;
        cv: {
            id: string;
            title: string | null;
            targetRole: string;
            currentVersionId: string | null;
            isArchived: boolean;
        } | null;
        uploadedFile: {
            id: string;
            originalName: string;
            mimeType: string;
            fileExtension: string;
            fileSizeBytes: number;
            storagePath: string;
            createdAt: Date;
        } | null;
        resultCvVersion: {
            id: string;
            versionNumber: number;
            versionType: import("../common/enums/database.enums").CvVersionType;
            targetRole: string;
            isCurrent: boolean;
            createdAt: Date;
        } | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    processRequest(userId: string, requestId: string): Promise<{
        id: string;
        userId: string;
        title: string | null;
        targetRole: string;
        sourceType: import("../common/enums/database.enums").CvSourceType;
        currentVersionId: string | null;
        isArchived: boolean;
        currentVersion: {
            jobDescription: string | null;
            summaryText: string | null;
            skillsText: string | null;
            personalDetail: {
                id: string;
                cvVersionId: string;
                fullName: string;
                email: string;
                phone: string | null;
                location: string | null;
                professionalSummary: string | null;
                createdAt: Date;
                updatedAt: Date;
            } | null;
            workExperiences: {
                id: string;
                cvVersionId: string;
                companyName: string;
                jobTitle: string;
                periodLabel: string;
                startDate: string | null;
                endDate: string | null;
                isCurrent: boolean;
                description: string | null;
                displayOrder: number;
                createdAt: Date;
                updatedAt: Date;
            }[];
            educationEntries: {
                id: string;
                cvVersionId: string;
                institutionName: string;
                degreeTitle: string;
                periodLabel: string;
                startDate: string | null;
                endDate: string | null;
                displayOrder: number;
                createdAt: Date;
                updatedAt: Date;
            }[];
            skills: {
                id: string;
                cvVersionId: string;
                skillId: string;
                displayOrder: number;
                skill: {
                    id: string;
                    name: string;
                    normalizedName: string;
                    category: string | null;
                    createdAt: Date;
                } | null;
            }[];
            id: string;
            cvId: string;
            versionNumber: number;
            versionType: import("../common/enums/database.enums").CvVersionType;
            targetRole: string;
            stylePreset: import("../common/enums/database.enums").CvStylePreset;
            isCurrent: boolean;
            createdByProcess: import("../common/enums/database.enums").CreatedByProcess;
            generatedFileUrl: string | null;
            generatedFileFormat: import("../common/enums/database.enums").GeneratedFileFormat | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        versions: {
            jobDescription: string | null;
            summaryText: string | null;
            skillsText: string | null;
            personalDetail: {
                id: string;
                cvVersionId: string;
                fullName: string;
                email: string;
                phone: string | null;
                location: string | null;
                professionalSummary: string | null;
                createdAt: Date;
                updatedAt: Date;
            } | null;
            workExperiences: {
                id: string;
                cvVersionId: string;
                companyName: string;
                jobTitle: string;
                periodLabel: string;
                startDate: string | null;
                endDate: string | null;
                isCurrent: boolean;
                description: string | null;
                displayOrder: number;
                createdAt: Date;
                updatedAt: Date;
            }[];
            educationEntries: {
                id: string;
                cvVersionId: string;
                institutionName: string;
                degreeTitle: string;
                periodLabel: string;
                startDate: string | null;
                endDate: string | null;
                displayOrder: number;
                createdAt: Date;
                updatedAt: Date;
            }[];
            skills: {
                id: string;
                cvVersionId: string;
                skillId: string;
                displayOrder: number;
                skill: {
                    id: string;
                    name: string;
                    normalizedName: string;
                    category: string | null;
                    createdAt: Date;
                } | null;
            }[];
            id: string;
            cvId: string;
            versionNumber: number;
            versionType: import("../common/enums/database.enums").CvVersionType;
            targetRole: string;
            stylePreset: import("../common/enums/database.enums").CvStylePreset;
            isCurrent: boolean;
            createdByProcess: import("../common/enums/database.enums").CreatedByProcess;
            generatedFileUrl: string | null;
            generatedFileFormat: import("../common/enums/database.enums").GeneratedFileFormat | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    updateRequest(userId: string, requestId: string, updateCvImprovementRequestDto: UpdateCvImprovementRequestDto): Promise<{
        id: string;
        userId: string;
        cvId: string | null;
        uploadedFileId: string;
        targetRole: string;
        jobDescription: string | null;
        status: import("../common/enums/database.enums").CvImprovementRequestStatus;
        errorMessage: string | null;
        resultCvVersionId: string | null;
        cv: {
            id: string;
            title: string | null;
            targetRole: string;
            currentVersionId: string | null;
            isArchived: boolean;
        } | null;
        uploadedFile: {
            id: string;
            originalName: string;
            mimeType: string;
            fileExtension: string;
            fileSizeBytes: number;
            storagePath: string;
            createdAt: Date;
        } | null;
        resultCvVersion: {
            id: string;
            versionNumber: number;
            versionType: import("../common/enums/database.enums").CvVersionType;
            targetRole: string;
            isCurrent: boolean;
            createdAt: Date;
        } | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
