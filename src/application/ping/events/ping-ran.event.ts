import { IEvent } from '@nestjs/cqrs';

export class PingRanEvent implements IEvent {
    public readonly date: Date = new Date();
}
