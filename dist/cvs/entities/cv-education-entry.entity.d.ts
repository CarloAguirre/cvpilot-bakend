import { CreatedUpdatedEntity } from '../../common/entities/timestamped.entity';
import { CvVersion } from './cv-version.entity';
export declare class CvEducationEntry extends CreatedUpdatedEntity {
    id: string;
    cvVersionId: string;
    institutionName: string;
    degreeTitle: string;
    periodLabel: string;
    startDate: string | null;
    endDate: string | null;
    displayOrder: number;
    cvVersion: CvVersion;
}
