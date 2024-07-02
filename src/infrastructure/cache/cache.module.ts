import {
    CacheModule as NestCacheModule,
    CacheOptions,
} from '@nestjs/cache-manager';
import { Global, Logger, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-yet';
import type { RedisClientOptions } from 'redis';

import { CacheConfigService } from '@/infrastructure/config/configs/cache-config.service';
import { RedisConfigService } from '@/infrastructure/config/configs/redis-config.service';

@Global()
@Module({
    imports: [
        NestCacheModule.registerAsync<RedisClientOptions>({
            useFactory: (
                redisConfig: RedisConfigService,
                cacheConfig: CacheConfigService,
            ) => {
                const logger = new Logger('CacheModule');

                logger.debug('Configuring CacheModule');

                if (!cacheConfig.useRedis) {
                    logger.warn('Using memory server for CacheModule');

                    return {
                        ttl: cacheConfig.ttl,
                    } as unknown as CacheOptions<RedisClientOptions>;
                }

                logger.warn('Using redis server for CacheModule');

                return {
                    store: redisStore,

                    url: redisConfig.url,

                    ttl: cacheConfig.ttl,
                } as unknown as CacheOptions<RedisClientOptions>;
            },
            inject: [RedisConfigService, CacheConfigService],
            isGlobal: true,
        }),
    ],
    exports: [],
})
export class CacheModule {}
