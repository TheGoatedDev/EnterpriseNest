import { Injectable, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { PingRanEvent } from '@/application/ping/events/ping-ran.event';

@EventsHandler(PingRanEvent)
@Injectable()
export class PingRanHandler implements IEventHandler<PingRanEvent> {
    private readonly logger = new Logger(PingRanHandler.name);

    handle(event: PingRanEvent) {
        this.logger.log('PingRanEvent handled successfully');
        return void 0;
    }
}
