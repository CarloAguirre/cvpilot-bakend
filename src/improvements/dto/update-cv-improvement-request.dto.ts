import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CvImprovementRequestStatus } from '../../common/enums/database.enums';

export class UpdateCvImprovementRequestDto {
  @IsOptional()
  @IsEnum(CvImprovementRequestStatus)
  status?: CvImprovementRequestStatus;

  @IsOptional()
  @IsString()
  errorMessage?: string;

  @IsOptional()
  @IsString()
  resultCvVersionId?: string;
}