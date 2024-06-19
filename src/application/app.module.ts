import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { context, trace } from '@opentelemetry/api';
import { OpenTelemetryModule } from 'nestjs-otel';
import { LoggerModule } from 'nestjs-pino';
import PinoPretty from 'pino-pretty';

import { ConfigModule } from '@/application/config/config.module';
import { MainConfigService } from '@/application/config/configs/main-config.service';
import { HealthModule } from '@/application/health/health.module';

@Module({
    imports: [
        LoggerModule.forRootAsync({
            inject: [MainConfigService],
            useFactory: (config: MainConfigService) => ({
                pinoHttp: {
                    level: config.NODE_ENV !== 'production' ? 'trace' : 'info',
                    formatters: {
                        log: (object) => {
                            const span = trace.getSpan(context.active());

                            if (!span) return { ...object };

                            const spanContext = trace
                                .getSpan(context.active())
                                ?.spanContext();

                            if (!spanContext) return { ...object };

                            const { spanId, traceId } = spanContext;

                            return { ...object, spanId, traceId };
                        },
                    },
                    transport:
                        config.NODE_ENV === 'development'
                            ? {
                                  target: 'pino-pretty',

                                  options: {
                                      ignore: 'context,hostname,pid,res,req',
                                      messageFormat: '{context} - {msg}',
                                  } as PinoPretty.PrettyOptions,
                              }
                            : undefined,
                },
            }),
        }),

        OpenTelemetryModule.forRoot({
            metrics: {
                hostMetrics: true,
                apiMetrics: {
                    enable: true,
                },
            },
        }),

        ConfigModule,
        HealthModule,
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
