import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CvSourceType } from '../../common/enums/database.enums';

export class CreateCvPersonalDetailsDto {
  @IsString()
  @MaxLength(150)
  fullName!: string;

  @IsEmail()
  email!: string;

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

export class CreateCvWorkExperienceDto {
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

export class CreateCvEducationEntryDto {
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

export class CreateCvDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  title?: string;

  @IsString()
  @MaxLength(150)
  targetRole!: string;

  @IsOptional()
  @IsString()
  sourceType?: CvSourceType;

  @IsOptional()
  @IsString()
  jobDescription?: string;

  @ValidateNested()
  @Type(() => CreateCvPersonalDetailsDto)
  personalDetails!: CreateCvPersonalDetailsDto;

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

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsString()
  skillsText?: string;
}