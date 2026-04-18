import { CreatedUpdatedEntity } from '../../common/entities/timestamped.entity';
import { CvImprovementRequestStatus } from '../../common/enums/database.enums';
import { CvVersion } from '../../cvs/entities/cv-version.entity';
import { Cv } from '../../cvs/entities/cv.entity';
import { UploadedFile } from '../../files/entities/uploaded-file.entity';
import { User } from '../../users/entities/user.entity';
export declare class CvImprovementRequest extends CreatedUpdatedEntity {
    id: string;
    userId: string;
    cvId: string | null;
    uploadedFileId: string;
    targetRole: string;
    jobDescription: string | null;
    status: CvImprovementRequestStatus;
    errorMessage: string | null;
    resultCvVersionId: string | null;
    user: User;
    cv: Cv | null;
    uploadedFile: UploadedFile;
    resultCvVersion: CvVersion | null;
}
