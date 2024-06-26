import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { ConfigSchema } from '@/application/system/config/config-schema';
import { AuthenticationConfigService } from '@/application/system/config/configs/authentication-config.service';
import { CacheConfigService } from '@/application/system/config/configs/cache-config.service';
import { MainConfigService } from '@/application/system/config/configs/main-config.service';
import { RedisConfigService } from '@/application/system/config/configs/redis-config.service';
import { ThrottlerConfigService } from '@/application/system/config/configs/throttler-config.service';

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
        AuthenticationConfigService,
    ],
    exports: [
        MainConfigService,
        RedisConfigService,
        CacheConfigService,
        ThrottlerConfigService,
        AuthenticationConfigService,
    ],
})
export class ConfigModule {}
