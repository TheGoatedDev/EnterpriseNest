import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { ConfigSchema } from '@/application/config/config-schema';
import { CacheConfigService } from '@/application/config/configs/cache-config.service';
import { MainConfigService } from '@/application/config/configs/main-config.service';
import { RedisConfigService } from '@/application/config/configs/redis-config.service';

@Global()
@Module({
    imports: [
        NestConfigModule.forRoot({
            cache: true,
            validate: (config) => ConfigSchema.parse(config),
        }),
    ],
    controllers: [],
    providers: [MainConfigService, RedisConfigService, CacheConfigService],
    exports: [MainConfigService, RedisConfigService, CacheConfigService],
})
export class ConfigModule {}
