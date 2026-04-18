import { Repository } from 'typeorm';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';
import { UserSetting } from './entities/user-setting.entity';
import { User } from './entities/user.entity';
export declare class UsersService {
    readonly usersRepository: Repository<User>;
    readonly userSettingsRepository: Repository<UserSetting>;
    constructor(usersRepository: Repository<User>, userSettingsRepository: Repository<UserSetting>);
    getProfile(userId: string): Promise<{
        id: string;
        fullName: string;
        email: string;
        status: import("../common/enums/database.enums").UserStatus;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(userId: string, updateUserProfileDto: UpdateUserProfileDto): Promise<{
        id: string;
        fullName: string;
        email: string;
        status: import("../common/enums/database.enums").UserStatus;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getSettings(userId: string): Promise<{
        id: string;
        userId: string;
        emailNotifications: boolean;
        autoSaveHistory: boolean;
        defaultLanguage: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateSettings(userId: string, updateUserSettingsDto: UpdateUserSettingsDto): Promise<{
        id: string;
        userId: string;
        emailNotifications: boolean;
        autoSaveHistory: boolean;
        defaultLanguage: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private ensureUserExists;
    private findOrCreateSettings;
    private toSafeUser;
    private toSettingsResponse;
}
