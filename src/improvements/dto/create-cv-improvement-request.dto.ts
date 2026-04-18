import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCvImprovementRequestDto {
  @IsOptional()
  @IsString()
  cvId?: string;

  @IsString()
  uploadedFileId!: string;

  @IsString()
  @MaxLength(150)
  targetRole!: string;

  @IsOptional()
  @IsString()
  jobDescription?: string;
}