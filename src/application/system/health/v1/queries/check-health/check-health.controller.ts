import { Controller, Get, HttpCode, Logger } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
    DiskHealthIndicator,
    HealthCheck,
    HealthCheckService,
    HttpHealthIndicator,
} from '@nestjs/terminus';

@ApiTags('Health')
@Controller({
    version: '1',
})
export class V1CheckHealthController {
    private readonly logger = new Logger(V1CheckHealthController.name);

    constructor(
        private readonly health: HealthCheckService,
        private readonly http: HttpHealthIndicator,
        private readonly disk: DiskHealthIndicator,
    ) {}

    @Get('/health')
    @ApiOperation({
        summary: 'Health Check',
    })
    @HealthCheck()
    @HttpCode(200)
    healthCheck() {
        this.logger.log('Checking health');

        return this.health.check([
            () => this.http.pingCheck('internet', 'https://google.com'),
            () =>
                this.disk.checkStorage('storage', {
                    path: '/',
                    thresholdPercent: 0.5,
                }),
        ]);
    }
}
