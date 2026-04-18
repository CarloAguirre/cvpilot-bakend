import { Repository } from 'typeorm';
import { CvVersion } from '../cvs/entities/cv-version.entity';
import { Cv } from '../cvs/entities/cv.entity';
import { UploadedFile } from '../files/entities/uploaded-file.entity';
import { CreateCvImprovementRequestDto } from './dto/create-cv-improvement-request.dto';
import { UpdateCvImprovementRequestDto } from './dto/update-cv-improvement-request.dto';
import { CvImprovementRequest } from './entities/cv-improvement-request.entity';
export declare class ImprovementsService {
    readonly cvImprovementRequestsRepository: Repository<CvImprovementRequest>;
    readonly uploadedFilesRepository: Repository<UploadedFile>;
    readonly cvsRepository: Repository<Cv>;
    readonly cvVersionsRepository: Repository<CvVersion>;
    constructor(cvImprovementRequestsRepository: Repository<CvImprovementRequest>, uploadedFilesRepository: Repository<UploadedFile>, cvsRepository: Repository<Cv>, cvVersionsRepository: Repository<CvVersion>);
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
    private toRequestResponse;
}
