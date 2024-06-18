import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import PinoPretty from 'pino-pretty';

import { ConfigModule } from '@/application/config/config.module';
import { MainConfigService } from '@/application/config/configs/main-config.service';
import { HealthModule } from '@/application/health/health.module';

@Module({
    imports: [
        ConfigModule,
        LoggerModule.forRootAsync({
            inject: [MainConfigService],
            useFactory: (config: MainConfigService) => ({
                pinoHttp: {
                    level: config.NODE_ENV !== 'production' ? 'trace' : 'info',
                    transport:
                        config.NODE_ENV === 'development'
                            ? {
                                  target: 'pino-pretty',

                                  options: {
                                      ignore: 'pid,hostname,context,dd,req,res',
                                      messageFormat: '{context} - {msg}',
                                  } as PinoPretty.PrettyOptions,
                              }
                            : undefined,
                },
            }),
        }),
        HealthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
