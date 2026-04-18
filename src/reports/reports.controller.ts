import { Body, Controller, Get, Post } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateReportSnapshotDto } from './dto/create-report-snapshot.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard-summary')
  getDashboardSummary(@CurrentUser('sub') userId: string) {
    return this.reportsService.getDashboardSummary(userId);
  }

  @Get('by-role')
  getReportsByRole(@CurrentUser('sub') userId: string) {
    return this.reportsService.getReportsByRole(userId);
  }

  @Get('by-version-type')
  getReportsByVersionType(@CurrentUser('sub') userId: string) {
    return this.reportsService.getReportsByVersionType(userId);
  }

  @Get('monthly')
  getMonthlyReports(@CurrentUser('sub') userId: string) {
    return this.reportsService.getMonthlyReports(userId);
  }

  @Get('snapshots')
  listSnapshots(@CurrentUser('sub') userId: string) {
    return this.reportsService.listSnapshots(userId);
  }

  @Post('snapshots')
  createSnapshot(
    @CurrentUser('sub') userId: string,
    @Body() createReportSnapshotDto: CreateReportSnapshotDto,
  ) {
    return this.reportsService.createSnapshot(userId, createReportSnapshotDto);
  }
}