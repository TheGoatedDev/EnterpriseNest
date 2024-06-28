import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { V1CheckHealthController } from '@/application/health/v1/queries/check-health/check-health.controller';

@Module({
    imports: [TerminusModule, HttpModule],
    controllers: [V1CheckHealthController],
    providers: [],
})
export class V1HealthModule {}
