import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard } from '@nestjs/throttler';
import { OpenTelemetryModule } from 'nestjs-otel';

import { AuthenticationModule } from '@/application/authentication/authentication.module';
import { AccessTokenGuard } from '@/application/authentication/strategies/access-token/access-token.guard';
import { HealthModule } from '@/application/system/health/health.module';
import { PingModule } from '@/application/system/ping/ping.module';
import { UserModule } from '@/application/user/user.module';
import { CacheModule } from '@/infrastructure/cache/cache.module';
import { ConfigModule } from '@/infrastructure/config/config.module';
import { CqrsModule } from '@/infrastructure/cqrs/cqrs.module';
import { LoggerModule } from '@/infrastructure/logger/logger.module';
import { RepositoriesModule } from '@/infrastructure/repositories/repositories.module';
import { ThrottlerModule } from '@/infrastructure/throttler/throttler.module';
import { RolesClassSerializerInterceptor } from '@/shared/interceptors/role-class-serializer.interceptor';

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
            useClass: AccessTokenGuard,
        },
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
        {
            provide: APP_INTERCEPTOR,
            inject: [Reflector],
            useFactory: (reflector: Reflector) =>
                new RolesClassSerializerInterceptor(reflector, {
                    enableImplicitConversion: true,
                    excludeExtraneousValues: true,
                }),
        },
    ],
})
export class AppModule {}
