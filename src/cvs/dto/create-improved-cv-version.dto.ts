import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  CreatedByProcess,
  CvSourceType,
  CvStylePreset,
  GeneratedFileFormat,
} from '../../common/enums/database.enums';
import {
  CreateCvEducationEntryDto,
  CreateCvWorkExperienceDto,
} from './create-cv.dto';

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

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(30)
  @ValidateNested({ each: true })
  @Type(() => CreateCvWorkExperienceDto)
  workExperiences?: CreateCvWorkExperienceDto[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => CreateCvEducationEntryDto)
  educationEntries?: CreateCvEducationEntryDto[];
}