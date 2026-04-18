import { IsBoolean } from 'class-validator';

export class UpdateCvArchiveDto {
  @IsBoolean()
  isArchived!: boolean;
}