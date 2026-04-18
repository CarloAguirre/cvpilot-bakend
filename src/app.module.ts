import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { getDatabaseConfig } from './config/database.config';
import { AuditModule } from './audit/audit.module';
import { CvsModule } from './cvs/cvs.module';
import { EventsModule } from './events/events.module';
import { FilesModule } from './files/files.module';
import { ImprovementsModule } from './improvements/improvements.module';
import { ReportsModule } from './reports/reports.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    AuthModule,
    UsersModule,
    CvsModule,
    FilesModule,
    ImprovementsModule,
    ReportsModule,
    AuditModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
