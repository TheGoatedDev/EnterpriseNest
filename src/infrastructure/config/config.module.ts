import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { ConfigSchema } from '@/infrastructure/config/config-schema';
import { AuthenticationConfigService } from '@/infrastructure/config/configs/authentication-config.service';
import { CacheConfigService } from '@/infrastructure/config/configs/cache-config.service';
import { EmailConfigService } from '@/infrastructure/config/configs/email.config.service';
import { JwtConfigService } from '@/infrastructure/config/configs/jwt-config.service';
import { MainConfigService } from '@/infrastructure/config/configs/main-config.service';
import { RedisConfigService } from '@/infrastructure/config/configs/redis-config.service';
import { ThrottlerConfigService } from '@/infrastructure/config/configs/throttler-config.service';
import { TokenConfigService } from '@/infrastructure/config/configs/token-config.service';

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
        EmailConfigService,
        TokenConfigService,
        JwtConfigService,
    ],
    exports: [
        MainConfigService,
        RedisConfigService,
        CacheConfigService,
        ThrottlerConfigService,
        AuthenticationConfigService,
        EmailConfigService,
        TokenConfigService,
        JwtConfigService,
    ],
})
export class ConfigModule {}
