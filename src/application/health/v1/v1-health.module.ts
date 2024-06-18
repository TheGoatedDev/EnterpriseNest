import { Module } from '@nestjs/common';

import { V1CheckHealthController } from '@/application/health/v1/queries/check-health/check-health.controller';

@Module({
    imports: [],
    controllers: [V1CheckHealthController],
    providers: [],
})
export class V1HealthModule {}
