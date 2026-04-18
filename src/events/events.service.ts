import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemEvent } from './entities/system-event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(SystemEvent)
    readonly systemEventsRepository: Repository<SystemEvent>,
  ) {}
}