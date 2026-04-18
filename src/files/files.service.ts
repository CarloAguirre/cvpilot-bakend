import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUploadedFileDto } from './dto/create-uploaded-file.dto';
import { UploadedFile } from './entities/uploaded-file.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(UploadedFile)
    readonly uploadedFilesRepository: Repository<UploadedFile>,
  ) {}

  async listUserFiles(userId: string) {
    const files = await this.uploadedFilesRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return files.map((file) => this.toFileResponse(file));
  }

  async createFileRecord(userId: string, createUploadedFileDto: CreateUploadedFileDto) {
    const file = this.uploadedFilesRepository.create({
      userId,
      originalName: createUploadedFileDto.originalName.trim(),
      storagePath: createUploadedFileDto.storagePath.trim(),
      mimeType: createUploadedFileDto.mimeType.trim(),
      fileExtension: createUploadedFileDto.fileExtension.trim().toLowerCase(),
      fileSizeBytes: String(createUploadedFileDto.fileSizeBytes),
      checksum: createUploadedFileDto.checksum?.trim() ?? null,
    });

    const savedFile = await this.uploadedFilesRepository.save(file);
    return this.toFileResponse(savedFile);
  }

  async storeUploadedFile(
    userId: string,
    createUploadedFileDto: CreateUploadedFileDto,
  ) {
    return this.createFileRecord(userId, createUploadedFileDto);
  }

  private toFileResponse(file: UploadedFile) {
    return {
      id: file.id,
      userId: file.userId,
      originalName: file.originalName,
      storagePath: file.storagePath,
      mimeType: file.mimeType,
      fileExtension: file.fileExtension,
      fileSizeBytes: Number(file.fileSizeBytes),
      checksum: file.checksum,
      createdAt: file.createdAt,
    };
  }
}