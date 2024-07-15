import { ScheduleModule } from '@nestjs/schedule';
import { Test } from '@nestjs/testing';
import { OpenTelemetryModule } from 'nestjs-otel';

import { AppModule } from '@/application/app.module';
import { AuthenticationModule } from '@/application/authentication/authentication.module';
import { HealthModule } from '@/application/health/health.module';
import { PingModule } from '@/application/ping/ping.module';
import { SessionModule } from '@/application/session/session.module';
import { UserModule } from '@/application/user/user.module';
import { VerificationModule } from '@/application/verification/verification.module';
import { CacheModule } from '@/infrastructure/cache/cache.module';
import { ConfigModule } from '@/infrastructure/config/config.module';
import { CqrsModule } from '@/infrastructure/cqrs/cqrs.module';
import { LoggerModule } from '@/infrastructure/logger/logger.module';
import { MailerModule } from '@/infrastructure/mailer/mailer.module';
import { MockRepositoriesModule } from '@/infrastructure/repositories/presets/mock-repositories.module';
import { RepositoriesModule } from '@/infrastructure/repositories/repositories.module';
import { ThrottlerModule } from '@/infrastructure/throttler/throttler.module';
import { TokenModule } from '@/infrastructure/token/token.module';

describe('appModule', () => {
    it('should compile the module', async () => {
        const module = await Test.createTestingModule({
            imports: [AppModule, MockRepositoriesModule],
        }).compile();

        expect(module).toBeDefined();
        // Check if all modules are correctly imported
        // System Modules
        expect(module.get(CqrsModule)).toBeInstanceOf(CqrsModule); // CQRS Module for Command Query Responsibility Segregation
        expect(module.get(ConfigModule)).toBeInstanceOf(ConfigModule); // Configuration Module
        expect(module.get(CacheModule)).toBeInstanceOf(CacheModule); // Cache Module
        expect(module.get(LoggerModule)).toBeInstanceOf(LoggerModule); // Logger Module
        expect(module.get(ThrottlerModule)).toBeInstanceOf(ThrottlerModule); // Throttler Module
        expect(module.get(RepositoriesModule)).toBeInstanceOf(
            RepositoriesModule,
        ); // Repositories Module
        expect(module.get(ScheduleModule)).toBeInstanceOf(ScheduleModule); // Schedule Module for Cron Jobs
        expect(module.get(OpenTelemetryModule)).toBeInstanceOf(
            OpenTelemetryModule,
        ); // OpenTelemetry Module for Tracing
        expect(module.get(MailerModule)).toBeInstanceOf(MailerModule); // Email Module
        expect(module.get(TokenModule)).toBeInstanceOf(TokenModule); // Token Module

        // Application Modules
        expect(module.get(HealthModule)).toBeInstanceOf(HealthModule); // Health Module
        expect(module.get(PingModule)).toBeInstanceOf(PingModule); // Ping Module
        expect(module.get(AuthenticationModule)).toBeInstanceOf(
            AuthenticationModule,
        ); // Authentication Module
        expect(module.get(SessionModule)).toBeInstanceOf(SessionModule); // Session Module
        expect(module.get(VerificationModule)).toBeInstanceOf(
            VerificationModule,
        ); // Verification Module
        expect(module.get(UserModule)).toBeInstanceOf(UserModule); // User Module
    });
});
