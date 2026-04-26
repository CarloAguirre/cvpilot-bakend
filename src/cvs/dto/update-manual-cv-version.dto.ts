import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CvStylePreset } from '../../common/enums/database.enums';

export class ManualEditCvPersonalDetailsDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  location?: string;

  @IsOptional()
  @IsString()
  professionalSummary?: string;
}

export class ManualEditCvWorkExperienceDto {
  @IsString()
  @MaxLength(150)
  companyName!: string;

  @IsString()
  @MaxLength(150)
  jobTitle!: string;

  @IsString()
  @MaxLength(100)
  periodLabel!: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;

  @IsOptional()
  @IsString()
  description?: string;
}

export class ManualEditCvEducationEntryDto {
  @IsString()
  @MaxLength(150)
  institutionName!: string;

  @IsString()
  @MaxLength(150)
  degreeTitle!: string;

  @IsString()
  @MaxLength(100)
  periodLabel!: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}

export class UpdateManualCvVersionDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  targetRole?: string;

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
  @ValidateNested()
  @Type(() => ManualEditCvPersonalDetailsDto)
  personalDetails?: ManualEditCvPersonalDetailsDto;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(30)
  @ValidateNested({ each: true })
  @Type(() => ManualEditCvWorkExperienceDto)
  workExperiences?: ManualEditCvWorkExperienceDto[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => ManualEditCvEducationEntryDto)
  educationEntries?: ManualEditCvEducationEntryDto[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  skills?: string[];
}