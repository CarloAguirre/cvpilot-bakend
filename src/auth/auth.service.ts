import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { IsNull, MoreThan, Not, Repository } from 'typeorm';
import { UserStatus } from '../common/enums/database.enums';
import { UserSetting } from '../users/entities/user-setting.entity';
import { User } from '../users/entities/user.entity';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(UserSetting)
    private readonly userSettingsRepository: Repository<UserSetting>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const normalizedEmail = registerDto.email.trim().toLowerCase();
    const existingUser = await this.usersRepository.findOne({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new ConflictException('El correo ya está registrado');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10);
    const user = this.usersRepository.create({
      fullName: registerDto.fullName.trim(),
      email: normalizedEmail,
      passwordHash,
      status: UserStatus.ACTIVE,
      lastLoginAt: null,
      passwordResetTokenHash: null,
      passwordResetExpiresAt: null,
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

  async login(loginDto: LoginDto) {
    const normalizedEmail = loginDto.email.trim().toLowerCase();
    const user = await this.usersRepository.findOne({
      where: { email: normalizedEmail },
    });

    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    user.lastLoginAt = new Date();
    const updatedUser = await this.usersRepository.save(user);

    return this.buildAuthResponse(updatedUser);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const normalizedEmail = forgotPasswordDto.email.trim().toLowerCase();
    const user = await this.usersRepository.findOne({
      where: { email: normalizedEmail, status: UserStatus.ACTIVE },
    });

    if (!user) {
      return {
        message:
          'Si el correo está registrado, se generó un token de recuperación',
      };
    }

    const rawResetToken = randomBytes(32).toString('hex');
    const passwordResetTokenHash = await bcrypt.hash(rawResetToken, 10);

    user.passwordResetTokenHash = passwordResetTokenHash;
    user.passwordResetExpiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await this.usersRepository.save(user);

    return {
      message:
        'Si el correo está registrado, se generó un token de recuperación',
      resetToken: rawResetToken,
      expiresAt: user.passwordResetExpiresAt,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const candidateUsers = await this.usersRepository.find({
      where: {
        status: UserStatus.ACTIVE,
        passwordResetTokenHash: Not(IsNull()),
        passwordResetExpiresAt: MoreThan(new Date()),
      },
    });

    let matchedUser: User | null = null;

    for (const candidateUser of candidateUsers) {
      const isValidToken = await bcrypt.compare(
        resetPasswordDto.token,
        candidateUser.passwordResetTokenHash as string,
      );

      if (isValidToken) {
        matchedUser = candidateUser;
        break;
      }
    }

    if (!matchedUser) {
      throw new BadRequestException(
        'El token de recuperación es inválido o expiró',
      );
    }

    matchedUser.passwordHash = await bcrypt.hash(
      resetPasswordDto.newPassword,
      10,
    );
    matchedUser.passwordResetTokenHash = null;
    matchedUser.passwordResetExpiresAt = null;

    await this.usersRepository.save(matchedUser);

    return {
      message: 'Contraseña actualizada correctamente',
    };
  }

  async getCurrentUser(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
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

  private buildAuthResponse(user: User) {
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
}