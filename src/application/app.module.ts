import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard } from '@nestjs/throttler';
import { OpenTelemetryModule } from 'nestjs-otel';

import { AuthenticationModule } from '@/application/modules/authentication/authentication.module';
import { AccessTokenGuard } from '@/application/modules/authentication/strategies/access-token/access-token.guard';
import { UserModule } from '@/application/modules/user/user.module';
import { CacheModule } from '@/application/system/cache/cache.module';
import { ConfigModule } from '@/application/system/config/config.module';
import { CqrsModule } from '@/application/system/cqrs/cqrs.module';
import { HealthModule } from '@/application/system/health/health.module';
import { JwtModule } from '@/application/system/jwt/jwt.module';
import { LoggerModule } from '@/application/system/logger/logger.module';
import { PingModule } from '@/application/system/ping/ping.module';
import { RepositoriesModule } from '@/application/system/repositories/repositories.module';
import { ThrottlerModule } from '@/application/system/throttler/throttler.module';
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
        JwtModule, // JWT Module for Authentication
        OpenTelemetryModule.forRoot({
            metrics: {
                hostMetrics: true,
                apiMetrics: {
                    enable: true,
                },
            },
        }), // OpenTelemetry Module for Tracing
        HealthModule,
        PingModule,

        // Application Modules
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
