import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UserStatus } from '../common/enums/database.enums';
import { UserSetting } from '../users/entities/user-setting.entity';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private readonly usersRepository;
    private readonly userSettingsRepository;
    private readonly jwtService;
    constructor(usersRepository: Repository<User>, userSettingsRepository: Repository<UserSetting>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            fullName: string;
            email: string;
            status: UserStatus;
            lastLoginAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            fullName: string;
            email: string;
            status: UserStatus;
            lastLoginAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    getCurrentUser(userId: string): Promise<{
        id: string;
        fullName: string;
        email: string;
        status: UserStatus;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private buildAuthResponse;
}
