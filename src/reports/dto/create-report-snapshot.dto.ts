import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateReportSnapshotDto {
  @IsString()
  @MaxLength(50)
  reportType!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  reportPeriod?: string;
}