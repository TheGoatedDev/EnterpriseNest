import { Global, Module } from '@nestjs/common';
import { context, trace } from '@opentelemetry/api';
import { LoggerModule as BaseLoggerModule } from 'nestjs-pino';
import PinoPretty from 'pino-pretty';

import { MainConfigService } from '@/application/config/configs/main-config.service';

@Global()
@Module({
    imports: [
        BaseLoggerModule.forRootAsync({
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
    ],
    exports: [],
})
export class LoggerModule {}
