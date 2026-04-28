import { IsOptional, IsString, MaxLength } from 'class-validator';
import { CreateCvDto } from './create-cv.dto';

export class GenerateCvFromFormDto extends CreateCvDto {
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  generationInstructions?: string;
}