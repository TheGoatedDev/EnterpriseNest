import { All, Controller, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CheckHealthDto } from '@/application/health/v1/queries/check-health/check-health.dto';
import { ApiStandardisedResponse } from '@/shared/decorator/api-standardised-response.decorator';

@ApiTags('Health')
@Controller({
    version: '1',
})
export class V1CheckHealthController {
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
        return {
            message: 'OK',
            serverTime: new Date(),
        };
    }
}
