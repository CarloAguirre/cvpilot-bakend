import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvVersion } from '../cvs/entities/cv-version.entity';
import { Cv } from '../cvs/entities/cv.entity';
import { UploadedFile } from '../files/entities/uploaded-file.entity';
import { CvImprovementRequest } from './entities/cv-improvement-request.entity';
import { ImprovementsController } from './improvements.controller';
import { ImprovementsService } from './improvements.service';

@Module({
  imports: [
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