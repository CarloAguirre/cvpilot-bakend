"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_setting_entity_1 = require("./entities/user-setting.entity");
const user_entity_1 = require("./entities/user.entity");
let UsersService = class UsersService {
    usersRepository;
    userSettingsRepository;
    constructor(usersRepository, userSettingsRepository) {
        this.usersRepository = usersRepository;
        this.userSettingsRepository = userSettingsRepository;
    }
    async getProfile(userId) {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.toSafeUser(user);
    }
    async updateProfile(userId, updateUserProfileDto) {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (updateUserProfileDto.email) {
            const normalizedEmail = updateUserProfileDto.email.trim().toLowerCase();
            const emailOwner = await this.usersRepository.findOne({
                where: { email: normalizedEmail },
            });
            if (emailOwner && emailOwner.id !== user.id) {
                throw new common_1.ConflictException('Email already in use');
            }
            user.email = normalizedEmail;
        }
        if (updateUserProfileDto.fullName !== undefined) {
            user.fullName = updateUserProfileDto.fullName.trim();
        }
        const updatedUser = await this.usersRepository.save(user);
        return this.toSafeUser(updatedUser);
    }
    async getSettings(userId) {
        await this.ensureUserExists(userId);
        const settings = await this.findOrCreateSettings(userId);
        return this.toSettingsResponse(settings);
    }
    async updateSettings(userId, updateUserSettingsDto) {
        await this.ensureUserExists(userId);
        const settings = await this.findOrCreateSettings(userId);
        Object.assign(settings, updateUserSettingsDto);
        const updatedSettings = await this.userSettingsRepository.save(settings);
        return this.toSettingsResponse(updatedSettings);
    }
    async ensureUserExists(userId) {
        const user = await this.usersRepository.findOne({
            select: {
                id: true,
            },
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
    }
    async findOrCreateSettings(userId) {
        const existingSettings = await this.userSettingsRepository.findOne({
            where: { userId },
        });
        if (existingSettings) {
            return existingSettings;
        }
        const settings = this.userSettingsRepository.create({
            userId,
            emailNotifications: true,
            autoSaveHistory: true,
            defaultLanguage: 'en',
        });
        return this.userSettingsRepository.save(settings);
    }
    toSafeUser(user) {
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
    toSettingsResponse(settings) {
        return {
            id: settings.id,
            userId: settings.userId,
            emailNotifications: settings.emailNotifications,
            autoSaveHistory: settings.autoSaveHistory,
            defaultLanguage: settings.defaultLanguage,
            createdAt: settings.createdAt,
            updatedAt: settings.updatedAt,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(user_setting_entity_1.UserSetting)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map