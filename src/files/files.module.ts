import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesController } from './files.controller';
import { UploadedFile } from './entities/uploaded-file.entity';
import { FilesService } from './files.service';

@Module({
  imports: [TypeOrmModule.forFeature([UploadedFile])],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [TypeOrmModule, FilesService],
})
export class FilesModule {}