import { Repository } from 'typeorm';
import { CreateUploadedFileDto } from './dto/create-uploaded-file.dto';
import { UploadedFile } from './entities/uploaded-file.entity';
export declare class FilesService {
    readonly uploadedFilesRepository: Repository<UploadedFile>;
    constructor(uploadedFilesRepository: Repository<UploadedFile>);
    listUserFiles(userId: string): Promise<{
        id: string;
        userId: string;
        originalName: string;
        storagePath: string;
        mimeType: string;
        fileExtension: string;
        fileSizeBytes: number;
        checksum: string | null;
        createdAt: Date;
    }[]>;
    createFileRecord(userId: string, createUploadedFileDto: CreateUploadedFileDto): Promise<{
        id: string;
        userId: string;
        originalName: string;
        storagePath: string;
        mimeType: string;
        fileExtension: string;
        fileSizeBytes: number;
        checksum: string | null;
        createdAt: Date;
    }>;
    storeUploadedFile(userId: string, createUploadedFileDto: CreateUploadedFileDto): Promise<{
        id: string;
        userId: string;
        originalName: string;
        storagePath: string;
        mimeType: string;
        fileExtension: string;
        fileSizeBytes: number;
        checksum: string | null;
        createdAt: Date;
    }>;
    private toFileResponse;
}
