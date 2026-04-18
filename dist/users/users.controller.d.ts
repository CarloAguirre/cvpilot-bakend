import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
}
