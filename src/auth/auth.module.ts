import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSetting } from '../users/entities/user-setting.entity';
import { User } from '../users/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, UserSetting]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const expiresIn =
          (configService.get<string>('JWT_EXPIRES_IN') ?? '1d') as StringValue;

        return {
          secret: configService.get<string>('JWT_SECRET') ?? 'change-me',
          signOptions: {
            expiresIn,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAuthGuard,
    {
      provide: APP_GUARD,
      useExisting: JwtAuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}