import { Global, Module } from '@nestjs/common';
import { context, Span, trace } from '@opentelemetry/api';
import { LoggerModule as BaseLoggerModule } from 'nestjs-pino';
import PinoPretty from 'pino-pretty';

import { MainConfigService } from '@/infrastructure/config/configs/main-config.service';

@Global()
@Module({
    imports: [
        BaseLoggerModule.forRootAsync({
            inject: [MainConfigService],
            useFactory: (config: MainConfigService) => ({
                pinoHttp: {
                    level: config.DEBUG ? 'trace' : 'info',
                    formatters: {
                        log: (object) => {
                            const span = trace.getSpan(context.active()) as
                                | (Span & {
                                      attributes: Record<string, string>;
                                  })
                                | undefined;

                            if (!span) return { ...object };

                            const spanContext = trace
                                .getSpan(context.active())
                                ?.spanContext();

                            if (!spanContext) return { ...object };

                            const { spanId, traceId } = spanContext;

                            const { userId, userEmail } = span.attributes;

                            return {
                                ...object,
                                spanId,
                                traceId,
                                userId,
                                userEmail,
                            };
                        },
                    },
                    transport:
                        config.NODE_ENV === 'development'
                            ? {
                                  target: 'pino-pretty',

                                  options: {
                                      ignore: 'context,hostname,pid,res,req,spanId,traceId',
                                      messageFormat: '{context} - {msg}',
                                  } as PinoPretty.PrettyOptions,
                              }
                            : undefined,
                },
            }),
        }),
    ],
    exports: [],
})
export class LoggerModule {}
