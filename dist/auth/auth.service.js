"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt = __importStar(require("bcryptjs"));
const typeorm_2 = require("typeorm");
const database_enums_1 = require("../common/enums/database.enums");
const user_setting_entity_1 = require("../users/entities/user-setting.entity");
const user_entity_1 = require("../users/entities/user.entity");
let AuthService = class AuthService {
    usersRepository;
    userSettingsRepository;
    jwtService;
    constructor(usersRepository, userSettingsRepository, jwtService) {
        this.usersRepository = usersRepository;
        this.userSettingsRepository = userSettingsRepository;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const normalizedEmail = registerDto.email.trim().toLowerCase();
        const existingUser = await this.usersRepository.findOne({
            where: { email: normalizedEmail },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already registered');
        }
        const passwordHash = await bcrypt.hash(registerDto.password, 10);
        const user = this.usersRepository.create({
            fullName: registerDto.fullName.trim(),
            email: normalizedEmail,
            passwordHash,
            status: database_enums_1.UserStatus.ACTIVE,
            lastLoginAt: null,
        });
        const savedUser = await this.usersRepository.save(user);
        const existingSettings = await this.userSettingsRepository.findOne({
            where: { userId: savedUser.id },
        });
        if (!existingSettings) {
            const defaultSettings = this.userSettingsRepository.create({
                userId: savedUser.id,
                emailNotifications: true,
                autoSaveHistory: true,
                defaultLanguage: 'en',
            });
            await this.userSettingsRepository.save(defaultSettings);
        }
        return this.buildAuthResponse(savedUser);
    }
    async login(loginDto) {
        const normalizedEmail = loginDto.email.trim().toLowerCase();
        const user = await this.usersRepository.findOne({
            where: { email: normalizedEmail },
        });
        if (!user || user.status !== database_enums_1.UserStatus.ACTIVE) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isValidPassword = await bcrypt.compare(loginDto.password, user.passwordHash);
        if (!isValidPassword) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        user.lastLoginAt = new Date();
        const updatedUser = await this.usersRepository.save(user);
        return this.buildAuthResponse(updatedUser);
    }
    async getCurrentUser(userId) {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            status: user.status,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
    buildAuthResponse(user) {
        const accessToken = this.jwtService.sign({
            sub: user.id,
            email: user.email,
        });
        return {
            accessToken,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                status: user.status,
                lastLoginAt: user.lastLoginAt,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(user_setting_entity_1.UserSetting)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map