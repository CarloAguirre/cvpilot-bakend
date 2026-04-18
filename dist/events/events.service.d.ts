import { Repository } from 'typeorm';
import { SystemEvent } from './entities/system-event.entity';
export declare class EventsService {
    readonly systemEventsRepository: Repository<SystemEvent>;
    constructor(systemEventsRepository: Repository<SystemEvent>);
}
