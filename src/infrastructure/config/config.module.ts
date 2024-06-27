import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { ConfigSchema } from '@/infrastructure/config/config-schema';
import { AuthenticationConfigService } from '@/infrastructure/config/configs/authentication-config.service';
import { CacheConfigService } from '@/infrastructure/config/configs/cache-config.service';
import { MainConfigService } from '@/infrastructure/config/configs/main-config.service';
import { RedisConfigService } from '@/infrastructure/config/configs/redis-config.service';
import { ThrottlerConfigService } from '@/infrastructure/config/configs/throttler-config.service';

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
