import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportSnapshot } from './entities/report-snapshot.entity';
import { ReportsService } from './reports.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReportSnapshot])],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [TypeOrmModule, ReportsService],
})
export class ReportsModule {}