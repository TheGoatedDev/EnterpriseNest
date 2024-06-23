import { Module } from '@nestjs/common';

import { CQRSRedisOptions } from '@/application/cqrs/adapters/redis';
import { CqrsModule } from '@/application/cqrs/cqrs.module';
import { PingRanHandler } from '@/application/ping/event-handlers/ping-ran.handler';
import { PingRanEvent } from '@/application/ping/events/ping-ran.event';
import { V1PingModule } from '@/application/ping/v1/v1-ping.module';

const EventHandlers = [PingRanHandler];

@Module({
    imports: [
        CqrsModule.forRoot([PingRanEvent], CQRSRedisOptions),
        V1PingModule,
    ],
    controllers: [],
    providers: [...EventHandlers],
})
export class PingModule {}
