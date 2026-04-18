import { CreateUploadedFileDto } from './dto/create-uploaded-file.dto';
import { FilesService } from './files.service';
export declare class FilesController {
    private readonly filesService;
    constructor(filesService: FilesService);
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
    uploadFile(userId: string, file: Express.Multer.File | undefined): Promise<{
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
}
