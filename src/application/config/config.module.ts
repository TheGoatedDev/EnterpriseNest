import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { ConfigSchema } from '@/application/config/config-schema';
import { MainConfigService } from '@/application/config/configs/main-config.service';

@Global()
@Module({
    imports: [
        NestConfigModule.forRoot({
            cache: true,
            validate: (config) => ConfigSchema.parse(config),
        }),
    ],
    controllers: [],
    providers: [MainConfigService],
    exports: [MainConfigService],
})
export class ConfigModule {}
