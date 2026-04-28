import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mkdir, writeFile } from 'node:fs/promises';
import { isAbsolute, relative, resolve } from 'node:path';

@Injectable()
export class GeneratedDocumentsStorageService {
  constructor(private readonly configService: ConfigService) {}

  async storeCvPdf(userId: string, pdfBuffer: Buffer) {
    const uploadRoot = resolve(
      process.cwd(),
      this.configService.get<string>('UPLOAD_DIR') ?? 'uploads',
    );

    const generatedCvRoot = resolve(
      process.cwd(),
      this.configService.get<string>('GENERATED_CV_DIR') ?? 'uploads/generated-cvs',
    );

    const relativeGeneratedRoot = relative(uploadRoot, generatedCvRoot);

    if (
      !relativeGeneratedRoot ||
      relativeGeneratedRoot.startsWith('..') ||
      isAbsolute(relativeGeneratedRoot)
    ) {
      throw new InternalServerErrorException(
        'GENERATED_CV_DIR must be inside UPLOAD_DIR',
      );
    }

    const destinationDir = resolve(generatedCvRoot, userId);
    await mkdir(destinationDir, { recursive: true });

    const fileName = `cv-${Date.now()}-${Math.round(Math.random() * 1e9)}.pdf`;
    const absoluteFilePath = resolve(destinationDir, fileName);
    await writeFile(absoluteFilePath, pdfBuffer);

    const relativeWithinUploadRoot = relative(uploadRoot, absoluteFilePath).replaceAll(
      '\\',
      '/',
    );

    const appBaseUrl =
      this.configService.get<string>('APP_BASE_URL')?.replace(/\/$/, '') ??
      `http://localhost:${this.configService.get<string>('PORT') ?? '3000'}`;

    return {
      absoluteFilePath,
      relativeWithinUploadRoot,
      publicUrl: `${appBaseUrl}/uploads/${relativeWithinUploadRoot}`,
    };
  }
}