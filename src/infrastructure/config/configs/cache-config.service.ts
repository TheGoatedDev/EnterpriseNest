import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

import { Config } from '@/infrastructure/config/config-schema';

@Injectable()
export class CacheConfigService {
    constructor(
        private readonly configService: NestConfigService<Config, true>,
    ) {}

    get ttl() {
        return this.configService.get<Config['CACHE_TTL_MS']>('CACHE_TTL_MS');
    }

    get useRedis() {
        return this.configService.get<Config['CACHE_USE_REDIS']>(
            'CACHE_USE_REDIS',
        );
    }
}
