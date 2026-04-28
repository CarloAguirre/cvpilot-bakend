import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateCvImprovementRequestDto } from './dto/create-cv-improvement-request.dto';
import { UpdateCvImprovementRequestDto } from './dto/update-cv-improvement-request.dto';
import { ImprovementsService } from './improvements.service';

@Controller('improvement-requests')
export class ImprovementsController {
  constructor(private readonly improvementsService: ImprovementsService) {}

  @Get()
  listRequests(@CurrentUser('sub') userId: string) {
    return this.improvementsService.listRequests(userId);
  }

  @Post()
  createRequest(
    @CurrentUser('sub') userId: string,
    @Body() createCvImprovementRequestDto: CreateCvImprovementRequestDto,
  ) {
    return this.improvementsService.createRequest(
      userId,
      createCvImprovementRequestDto,
    );
  }

  @Post(':requestId/process')
  processRequest(
    @CurrentUser('sub') userId: string,
    @Param('requestId') requestId: string,
  ) {
    return this.improvementsService.processRequest(userId, requestId);
  }

  @Patch(':requestId')
  updateRequest(
    @CurrentUser('sub') userId: string,
    @Param('requestId') requestId: string,
    @Body() updateCvImprovementRequestDto: UpdateCvImprovementRequestDto,
  ) {
    return this.improvementsService.updateRequest(
      userId,
      requestId,
      updateCvImprovementRequestDto,
    );
  }
}