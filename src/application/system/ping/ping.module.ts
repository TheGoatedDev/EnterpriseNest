import { Module } from '@nestjs/common';

import { PingRanHandler } from '@/application/system/ping/event-handlers/ping-ran.handler';
import { V1PingModule } from '@/application/system/ping/v1/v1-ping.module';

const EventHandlers = [PingRanHandler];

@Module({
    imports: [V1PingModule],
    controllers: [],
    providers: [...EventHandlers],
})
export class PingModule {}
