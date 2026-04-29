import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  token!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'newPassword must contain at least one uppercase letter and one number',
  })
  newPassword!: string;
}