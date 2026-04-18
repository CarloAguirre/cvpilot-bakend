import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserSettingsDto {
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  autoSaveHistory?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  defaultLanguage?: string;
}