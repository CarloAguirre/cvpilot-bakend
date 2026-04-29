import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import type { Request } from 'express';
import { mkdirSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { CreateUploadedFileDto } from './dto/create-uploaded-file.dto';
import { FilesService } from './files.service';

const ALLOWED_EXTENSIONS = new Set(['.pdf', '.docx', '.txt']);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const resolveUploadDir = (userId: string) => {
  const uploadRoot = process.env.UPLOAD_DIR ?? 'uploads';
  return join(process.cwd(), uploadRoot, userId);
};

type AuthenticatedRequest = Request & {
  user?: AuthenticatedUser;
};

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  listUserFiles(@CurrentUser('sub') userId: string) {
    return this.filesService.listUserFiles(userId);
  }

  @Post()
  createFileRecord(
    @CurrentUser('sub') userId: string,
    @Body() createUploadedFileDto: CreateUploadedFileDto,
  ) {
    return this.filesService.createFileRecord(userId, createUploadedFileDto);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (
          request: AuthenticatedRequest,
          _file: Express.Multer.File,
          callback: (error: Error | null, destination: string) => void,
        ) => {
          const userId = request.user?.sub ?? 'anonymous';
          const uploadDir = resolveUploadDir(userId);
          mkdirSync(uploadDir, { recursive: true });
          callback(null, uploadDir);
        },
        filename: (
          _request: AuthenticatedRequest,
          file: Express.Multer.File,
          callback: (error: Error | null, filename: string) => void,
        ) => {
          const extension = extname(file.originalname).toLowerCase();
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          callback(null, `${uniqueSuffix}${extension}`);
        },
      }),
      limits: {
        fileSize: MAX_FILE_SIZE_BYTES,
      },
      fileFilter: (
        _request: AuthenticatedRequest,
        file: Express.Multer.File,
        callback: (error: Error | null, acceptFile: boolean) => void,
      ) => {
        const extension = extname(file.originalname).toLowerCase();

        if (!ALLOWED_EXTENSIONS.has(extension)) {
          callback(
            new BadRequestException('Only PDF, DOCX, or TXT documents are allowed'),
            false,
          );
          return;
        }

        callback(null, true);
      },
    }),
  )
  uploadFile(
    @CurrentUser('sub') userId: string,
    @UploadedFile()
    file: Express.Multer.File | undefined,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const normalizedPath = relative(process.cwd(), file.path).replaceAll('\\', '/');

    return this.filesService.storeUploadedFile(userId, {
      originalName: file.originalname,
      storagePath: normalizedPath,
      mimeType: file.mimetype,
      fileExtension: extname(file.originalname).replace('.', '').toLowerCase(),
      fileSizeBytes: file.size,
    });
  }
}