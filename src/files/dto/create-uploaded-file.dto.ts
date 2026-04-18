import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateUploadedFileDto {
  @IsString()
  @MaxLength(255)
  originalName!: string;

  @IsString()
  storagePath!: string;

  @IsString()
  @MaxLength(100)
  mimeType!: string;

  @IsString()
  @MaxLength(10)
  fileExtension!: string;

  @IsInt()
  @IsPositive()
  fileSizeBytes!: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  checksum?: string;
}