import { Global, Module } from '@nestjs/common';
import { ThrottlerModule as BaseThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';

import { ConfigModule } from '@/application/system/config/config.module';
import { RedisConfigService } from '@/application/system/config/configs/redis-config.service';
import { ThrottlerConfigService } from '@/application/system/config/configs/throttler-config.service';

@Global()
@Module({
    imports: [
        BaseThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ThrottlerConfigService, RedisConfigService],
            useFactory: (
                throttlerConfig: ThrottlerConfigService,
                redisConfig: RedisConfigService,
            ) => ({
                throttlers: [
                    {
                        ttl: throttlerConfig.ttl,
                        limit: throttlerConfig.limit,
                    },
                ],

                storage: throttlerConfig.useRedis
                    ? new ThrottlerStorageRedisService(redisConfig.url)
                    : undefined,
            }),
        }),
    ],
    exports: [BaseThrottlerModule],
})
export class ThrottlerModule {}
