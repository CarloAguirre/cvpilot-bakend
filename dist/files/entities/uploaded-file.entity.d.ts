import { CreatedAtEntity } from '../../common/entities/timestamped.entity';
import { CvImprovementRequest } from '../../improvements/entities/cv-improvement-request.entity';
import { User } from '../../users/entities/user.entity';
export declare class UploadedFile extends CreatedAtEntity {
    id: string;
    userId: string;
    originalName: string;
    storagePath: string;
    mimeType: string;
    fileExtension: string;
    fileSizeBytes: string;
    checksum: string | null;
    user: User;
    cvImprovementRequests: CvImprovementRequest[];
}
