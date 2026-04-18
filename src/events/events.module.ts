import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemEvent } from './entities/system-event.entity';
import { EventsService } from './events.service';

@Module({
  imports: [TypeOrmModule.forFeature([SystemEvent])],
  providers: [EventsService],
  exports: [TypeOrmModule, EventsService],
})
export class EventsModule {}