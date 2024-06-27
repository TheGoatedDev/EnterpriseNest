import { Global, Module } from '@nestjs/common';
import { ThrottlerModule as BaseThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';

import { ConfigModule } from '@/infrastructure/config/config.module';
import { RedisConfigService } from '@/infrastructure/config/configs/redis-config.service';
import { ThrottlerConfigService } from '@/infrastructure/config/configs/throttler-config.service';

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
