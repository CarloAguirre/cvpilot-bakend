import { CreatedUpdatedEntity } from '../../common/entities/timestamped.entity';
import { User } from './user.entity';
export declare class UserSetting extends CreatedUpdatedEntity {
    id: string;
    userId: string;
    emailNotifications: boolean;
    autoSaveHistory: boolean;
    defaultLanguage: string;
    user: User;
}
