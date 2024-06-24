import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard } from '@nestjs/throttler';
import { OpenTelemetryModule } from 'nestjs-otel';

import { CacheModule } from '@/application/cache/cache.module';
import { ConfigModule } from '@/application/config/config.module';
import { CqrsModule } from '@/application/cqrs/cqrs.module';
import { HealthModule } from '@/application/health/health.module';
import { LoggerModule } from '@/application/logger/logger.module';
import { PingModule } from '@/application/ping/ping.module';
import { ThrottlerModule } from '@/application/throttler/throttler.module';

@Module({
    imports: [
        // System Modules
        CqrsModule, // CQRS Module for Command Query Responsibility Segregation
        ConfigModule, // Configuration Module
        CacheModule, // Cache Module
        LoggerModule, // Logger Module
        ThrottlerModule, // Throttler Module
        ScheduleModule.forRoot(), // Schedule Module for Cron Jobs
        OpenTelemetryModule.forRoot({
            metrics: {
                hostMetrics: true,
                apiMetrics: {
                    enable: true,
                },
            },
        }), // OpenTelemetry Module for Tracing

        // Application Modules
        HealthModule,
        PingModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
        {
            provide: APP_INTERCEPTOR,
            inject: [Reflector],
            useFactory: (reflector: Reflector) =>
                new ClassSerializerInterceptor(reflector, {
                    enableImplicitConversion: true,
                    excludeExtraneousValues: true,
                }),
        },
    ],
})
export class AppModule {}
