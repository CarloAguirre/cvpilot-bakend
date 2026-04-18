import { CreatedUpdatedEntity } from '../../common/entities/timestamped.entity';
import { CvVersion } from './cv-version.entity';
export declare class CvWorkExperience extends CreatedUpdatedEntity {
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
    cvVersion: CvVersion;
}
