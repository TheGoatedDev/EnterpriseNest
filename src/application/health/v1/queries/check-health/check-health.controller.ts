import { All, Controller, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller({
    version: '1',
})
export class V1CheckHealthController {
    @All('/health')
    @ApiOperation({
        summary: 'Health Check',
    })
    @ApiResponse({
        status: 200,
        description: 'The Health Check is successful',
        type: 'OK',
    })
    @HttpCode(200)
    healthCheck() {
        return 'OK';
    }
}
