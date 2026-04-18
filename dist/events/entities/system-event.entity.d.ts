import { CvVersion } from '../../cvs/entities/cv-version.entity';
import { Cv } from '../../cvs/entities/cv.entity';
import { User } from '../../users/entities/user.entity';
export declare class SystemEvent {
    id: string;
    userId: string;
    cvId: string | null;
    cvVersionId: string | null;
    eventType: string;
    eventDetail: string | null;
    createdAt: Date;
    user: User;
    cv: Cv | null;
    cvVersion: CvVersion | null;
}
