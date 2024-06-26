import { Controller, Get, HttpCode, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Public } from '@/application/modules/authentication/decorator/public.decorator';
import { MainConfigService } from '@/application/system/config/configs/main-config.service';
import { PingRanEvent } from '@/application/system/ping/events/ping-ran.event';
import { PingResponseDto } from '@/application/system/ping/v1/queries/ping/dto/ping.response.dto';
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

    @Public()
    @Get('/ping')
    @ApiOperation({
        summary: 'Ping',
    })
    @ApiStandardisedResponse(
        {
            status: 200,
            description: 'The Ping is successful',
        },
        PingResponseDto,
    )
    @HttpCode(200)
    healthCheck(): PingResponseDto {
        this.logger.log('Health Check is successful');

        this.eventBus.publish(new PingRanEvent());

        return {
            message: 'OK',
            serverTime: new Date(),
            appName: this.mainConfig.APP_NAME,
        };
    }
}
