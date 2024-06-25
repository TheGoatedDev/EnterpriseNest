import { Module } from '@nestjs/common';

import { V1PingController } from '@/application/modules/ping/v1/queries/ping/ping.controller';

@Module({
    imports: [],
    controllers: [V1PingController],
    providers: [],
})
export class V1PingModule {}
