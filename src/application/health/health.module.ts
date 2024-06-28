import { Module } from '@nestjs/common';

import { V1HealthModule } from '@/application/health/v1/v1-health.module';

@Module({
    imports: [V1HealthModule],
    controllers: [],
    providers: [],
})
export class HealthModule {}
