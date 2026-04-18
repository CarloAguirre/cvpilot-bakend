import { CreatedUpdatedEntity } from '../../common/entities/timestamped.entity';
import { CvVersion } from './cv-version.entity';
export declare class CvPersonalDetail extends CreatedUpdatedEntity {
    id: string;
    cvVersionId: string;
    fullName: string;
    email: string;
    phone: string | null;
    location: string | null;
    professionalSummary: string | null;
    cvVersion: CvVersion;
}
