import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  CreatedByProcess,
  CvSourceType,
  CvStylePreset,
  GeneratedFileFormat,
} from '../../common/enums/database.enums';

export class CreateImprovedCvVersionDto {
  @IsString()
  @MaxLength(150)
  targetRole!: string;

  @IsOptional()
  @IsString()
  jobDescription?: string;

  @IsOptional()
  @IsString()
  summaryText?: string;

  @IsOptional()
  @IsString()
  skillsText?: string;

  @IsOptional()
  @IsEnum(CvStylePreset)
  stylePreset?: CvStylePreset;

  @IsOptional()
  @IsString()
  generatedFileUrl?: string;

  @IsOptional()
  @IsEnum(GeneratedFileFormat)
  generatedFileFormat?: GeneratedFileFormat;

  @IsOptional()
  @IsEnum(CreatedByProcess)
  createdByProcess?: CreatedByProcess;

  @IsOptional()
  @IsEnum(CvSourceType)
  resultSourceType?: CvSourceType;

  @IsOptional()
  @IsString()
  improvementRequestId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];
}