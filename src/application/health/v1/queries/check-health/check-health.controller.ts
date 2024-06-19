import { All, Controller, HttpCode, Logger } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CheckHealthDto } from '@/application/health/v1/queries/check-health/check-health.dto';
import { ApiStandardisedResponse } from '@/shared/decorator/api-standardised-response.decorator';

@ApiTags('Health')
@Controller({
    version: '1',
})
export class V1CheckHealthController {
    private readonly logger = new Logger(V1CheckHealthController.name);

    @All('/health')
    @ApiOperation({
        summary: 'Health Check',
    })
    @ApiStandardisedResponse(
        {
            status: 200,
            description: 'The Health Check is successful',
        },
        CheckHealthDto,
    )
    @HttpCode(200)
    healthCheck(): CheckHealthDto {
        this.logger.log('Health Check is successful');

        return {
            message: 'OK',
            serverTime: new Date(),
        };
    }
}
