import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            fullName: string;
            email: string;
            status: import("../common/enums/database.enums").UserStatus;
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
            status: import("../common/enums/database.enums").UserStatus;
            lastLoginAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    me(userId: string): Promise<{
        id: string;
        fullName: string;
        email: string;
        status: import("../common/enums/database.enums").UserStatus;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
