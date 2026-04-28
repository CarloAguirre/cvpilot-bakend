import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateCvDto } from './dto/create-cv.dto';
import { GenerateCvFromFormDto } from './dto/generate-cv-from-form.dto';
import { CreateImprovedCvVersionDto } from './dto/create-improved-cv-version.dto';
import { UpdateCvArchiveDto } from './dto/update-cv-archive.dto';
import { UpdateManualCvVersionDto } from './dto/update-manual-cv-version.dto';
import { CvGenerationWorkflowService } from './generation/cv-generation-workflow.service';
import { CvsService } from './cvs.service';

@Controller('cvs')
export class CvsController {
  constructor(
    private readonly cvsService: CvsService,
    private readonly cvGenerationWorkflowService: CvGenerationWorkflowService,
  ) {}

  @Get()
  listUserCvs(@CurrentUser('sub') userId: string) {
    return this.cvsService.listUserCvs(userId);
  }

  @Post()
  createInitialCv(
    @CurrentUser('sub') userId: string,
    @Body() createCvDto: CreateCvDto,
  ) {
    return this.cvsService.createInitialCv(userId, createCvDto);
  }

  @Post('generate-from-form')
  generateFromForm(
    @CurrentUser('sub') userId: string,
    @Body() generateCvFromFormDto: GenerateCvFromFormDto,
  ) {
    return this.cvGenerationWorkflowService.generateFromForm(
      userId,
      generateCvFromFormDto,
    );
  }

  @Get(':cvId')
  getCv(@CurrentUser('sub') userId: string, @Param('cvId') cvId: string) {
    return this.cvsService.getCv(userId, cvId);
  }

  @Get(':cvId/history')
  getCvHistory(
    @CurrentUser('sub') userId: string,
    @Param('cvId') cvId: string,
  ) {
    return this.cvsService.getCvHistory(userId, cvId);
  }

  @Patch(':cvId/archive')
  updateArchiveState(
    @CurrentUser('sub') userId: string,
    @Param('cvId') cvId: string,
    @Body() updateCvArchiveDto: UpdateCvArchiveDto,
  ) {
    return this.cvsService.updateArchiveState(
      userId,
      cvId,
      updateCvArchiveDto,
    );
  }

  @Post(':cvId/versions/improved')
  createImprovedVersion(
    @CurrentUser('sub') userId: string,
    @Param('cvId') cvId: string,
    @Body() createImprovedCvVersionDto: CreateImprovedCvVersionDto,
  ) {
    return this.cvsService.createImprovedVersion(
      userId,
      cvId,
      createImprovedCvVersionDto,
    );
  }

  @Post(':cvId/versions/manual-edit')
  createManualEditedVersion(
    @CurrentUser('sub') userId: string,
    @Param('cvId') cvId: string,
    @Body() updateManualCvVersionDto: UpdateManualCvVersionDto,
  ) {
    return this.cvGenerationWorkflowService.createManualEditedVersion(
      userId,
      cvId,
      updateManualCvVersionDto,
    );
  }
}