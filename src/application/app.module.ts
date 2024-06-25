import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard } from '@nestjs/throttler';
import { OpenTelemetryModule } from 'nestjs-otel';

import { AuthenticationModule } from '@/application/modules/authentication/authentication.module';
import { PingModule } from '@/application/modules/ping/ping.module';
import { UserModule } from '@/application/modules/user/user.module';
import { CacheModule } from '@/application/system/cache/cache.module';
import { ConfigModule } from '@/application/system/config/config.module';
import { CqrsModule } from '@/application/system/cqrs/cqrs.module';
import { HealthModule } from '@/application/system/health/health.module';
import { LoggerModule } from '@/application/system/logger/logger.module';
import { RepositoriesModule } from '@/application/system/repositories/repositories.module';
import { ThrottlerModule } from '@/application/system/throttler/throttler.module';

@Module({
    imports: [
        // System Modules
        CqrsModule, // CQRS Module for Command Query Responsibility Segregation
        ConfigModule, // Configuration Module
        CacheModule, // Cache Module
        LoggerModule, // Logger Module
        ThrottlerModule, // Throttler Module
        RepositoriesModule, // Repositories Module
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
        AuthenticationModule,
        UserModule,
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
