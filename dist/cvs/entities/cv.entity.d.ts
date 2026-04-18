import { SoftDeleteEntity } from '../../common/entities/timestamped.entity';
import { CvSourceType } from '../../common/enums/database.enums';
import { SystemEvent } from '../../events/entities/system-event.entity';
import { CvImprovementRequest } from '../../improvements/entities/cv-improvement-request.entity';
import { User } from '../../users/entities/user.entity';
import { CvVersion } from './cv-version.entity';
export declare class Cv extends SoftDeleteEntity {
    id: string;
    userId: string;
    title: string | null;
    targetRole: string;
    sourceType: CvSourceType;
    currentVersionId: string | null;
    isArchived: boolean;
    user: User;
    currentVersion: CvVersion | null;
    versions: CvVersion[];
    improvementRequests: CvImprovementRequest[];
    systemEvents: SystemEvent[];
}
