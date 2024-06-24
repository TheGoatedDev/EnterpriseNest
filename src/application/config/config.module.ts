import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { ConfigSchema } from '@/application/config/config-schema';
import { CacheConfigService } from '@/application/config/configs/cache-config.service';
import { MainConfigService } from '@/application/config/configs/main-config.service';
import { RedisConfigService } from '@/application/config/configs/redis-config.service';
import { ThrottlerConfigService } from '@/application/config/configs/throttler-config.service';

@Global()
@Module({
    imports: [
        NestConfigModule.forRoot({
            cache: true,
            validate: (config) => ConfigSchema.parse(config),
            envFilePath: ['.env', '.env.local'],
        }),
    ],
    controllers: [],
    providers: [
        MainConfigService,
        RedisConfigService,
        CacheConfigService,
        ThrottlerConfigService,
    ],
    exports: [
        MainConfigService,
        RedisConfigService,
        CacheConfigService,
        ThrottlerConfigService,
    ],
})
export class ConfigModule {}
