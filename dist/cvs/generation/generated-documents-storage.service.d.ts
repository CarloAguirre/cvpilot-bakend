import { ConfigService } from '@nestjs/config';
export declare class GeneratedDocumentsStorageService {
    private readonly configService;
    constructor(configService: ConfigService);
    storeCvPdf(userId: string, pdfBuffer: Buffer): Promise<{
        absoluteFilePath: string;
        relativeWithinUploadRoot: string;
        publicUrl: string;
    }>;
}
