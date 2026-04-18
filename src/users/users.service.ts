import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';
import { UserSetting } from './entities/user-setting.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    readonly usersRepository: Repository<User>,
    @InjectRepository(UserSetting)
    readonly userSettingsRepository: Repository<UserSetting>,
  ) {}

  async getProfile(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.toSafeUser(user);
  }

  async updateProfile(userId: string, updateUserProfileDto: UpdateUserProfileDto) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserProfileDto.email) {
      const normalizedEmail = updateUserProfileDto.email.trim().toLowerCase();
      const emailOwner = await this.usersRepository.findOne({
        where: { email: normalizedEmail },
      });

      if (emailOwner && emailOwner.id !== user.id) {
        throw new ConflictException('Email already in use');
      }

      user.email = normalizedEmail;
    }

    if (updateUserProfileDto.fullName !== undefined) {
      user.fullName = updateUserProfileDto.fullName.trim();
    }

    const updatedUser = await this.usersRepository.save(user);
    return this.toSafeUser(updatedUser);
  }

  async getSettings(userId: string) {
    await this.ensureUserExists(userId);

    const settings = await this.findOrCreateSettings(userId);
    return this.toSettingsResponse(settings);
  }

  async updateSettings(
    userId: string,
    updateUserSettingsDto: UpdateUserSettingsDto,
  ) {
    await this.ensureUserExists(userId);

    const settings = await this.findOrCreateSettings(userId);
    Object.assign(settings, updateUserSettingsDto);

    const updatedSettings = await this.userSettingsRepository.save(settings);
    return this.toSettingsResponse(updatedSettings);
  }

  private async ensureUserExists(userId: string) {
    const user = await this.usersRepository.findOne({
      select: {
        id: true,
      },
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
  }

  private async findOrCreateSettings(userId: string) {
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

  private toSafeUser(user: User) {
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

  private toSettingsResponse(settings: UserSetting) {
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
}