import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvsModule } from '../cvs/cvs.module';
import { CvVersion } from '../cvs/entities/cv-version.entity';
import { Cv } from '../cvs/entities/cv.entity';
import { UploadedFile } from '../files/entities/uploaded-file.entity';
import { CvImprovementRequest } from './entities/cv-improvement-request.entity';
import { ImprovementsController } from './improvements.controller';
import { ImprovementsService } from './improvements.service';

@Module({
  imports: [
    CvsModule,
    TypeOrmModule.forFeature([
      CvImprovementRequest,
      UploadedFile,
      Cv,
      CvVersion,
    ]),
  ],
  controllers: [ImprovementsController],
  providers: [ImprovementsService],
  exports: [TypeOrmModule, ImprovementsService],
})
export class ImprovementsModule {}