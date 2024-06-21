import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { OpenTelemetryModule } from 'nestjs-otel';

import { CacheModule } from '@/application/cache/cache.module';
import { ConfigModule } from '@/application/config/config.module';
import { HealthModule } from '@/application/health/health.module';
import { LoggerModule } from '@/application/logger/logger.module';
import { PingModule } from '@/application/ping/ping.module';

@Module({
    imports: [
        LoggerModule,
        ScheduleModule.forRoot(),
        OpenTelemetryModule.forRoot({
            metrics: {
                hostMetrics: true,
                apiMetrics: {
                    enable: true,
                },
            },
        }),

        ConfigModule,
        CacheModule,
        HealthModule,
        PingModule,
    ],
    controllers: [],
    providers: [
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
