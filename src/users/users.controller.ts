import { Body, Controller, Get, Patch } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';
import { UsersService } from './users.service';

@Controller('users/me')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  getProfile(@CurrentUser('sub') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Patch('profile')
  updateProfile(
    @CurrentUser('sub') userId: string,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    return this.usersService.updateProfile(userId, updateUserProfileDto);
  }

  @Get('settings')
  getSettings(@CurrentUser('sub') userId: string) {
    return this.usersService.getSettings(userId);
  }

  @Patch('settings')
  updateSettings(
    @CurrentUser('sub') userId: string,
    @Body() updateUserSettingsDto: UpdateUserSettingsDto,
  ) {
    return this.usersService.updateSettings(userId, updateUserSettingsDto);
  }
}