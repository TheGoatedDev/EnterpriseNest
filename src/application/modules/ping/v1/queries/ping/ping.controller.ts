import { Controller, Get, HttpCode, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { PingRanEvent } from '@/application/modules/ping/events/ping-ran.event';
import { PingDto } from '@/application/modules/ping/v1/queries/ping/ping.dto';
import { MainConfigService } from '@/application/system/config/configs/main-config.service';
import { ApiStandardisedResponse } from '@/shared/decorator/api-standardised-response.decorator';

@ApiTags('Ping')
@Controller({
    version: '1',
})
export class V1PingController {
    private readonly logger = new Logger(V1PingController.name);

    constructor(
        private readonly mainConfig: MainConfigService,
        private readonly eventBus: EventBus,
    ) {}

    @Get('/ping')
    @ApiOperation({
        summary: 'Ping',
    })
    @ApiStandardisedResponse(
        {
            status: 200,
            description: 'The Ping is successful',
        },
        PingDto,
    )
    @HttpCode(200)
    healthCheck(): PingDto {
        this.logger.log('Health Check is successful');

        this.eventBus.publish(new PingRanEvent());

        return {
            message: 'OK',
            serverTime: new Date(),
            appName: this.mainConfig.APP_NAME,
        };
    }
}
