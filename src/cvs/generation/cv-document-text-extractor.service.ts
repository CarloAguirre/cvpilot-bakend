import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import mammoth from 'mammoth';
import { PDFParse } from 'pdf-parse';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

@Injectable()
export class CvDocumentTextExtractorService {
  async extractText(storagePath: string, fileExtension: string) {
    const normalizedExtension = fileExtension.trim().toLowerCase();
    const absolutePath = resolve(process.cwd(), storagePath);

    if (normalizedExtension === 'pdf') {
      const fileBuffer = await readFile(absolutePath);
      const parser = new PDFParse({ data: fileBuffer });
      const parsedPdf = await parser.getText();
      await parser.destroy();
      return this.normalizeExtractedText(parsedPdf.text);
    }

    if (normalizedExtension === 'docx') {
      const extractedDocument = await mammoth.extractRawText({ path: absolutePath });
      return this.normalizeExtractedText(extractedDocument.value);
    }

    throw new BadRequestException('Only PDF or DOCX files can be processed');
  }

  private normalizeExtractedText(rawText: string | null | undefined) {
    const normalizedText = (rawText ?? '').replaceAll(/\r\n?/g, '\n').trim();

    if (!normalizedText) {
      throw new InternalServerErrorException(
        'The uploaded document could not be parsed',
      );
    }

    return normalizedText;
  }
}