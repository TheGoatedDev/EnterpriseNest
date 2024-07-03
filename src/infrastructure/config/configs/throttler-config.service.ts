import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

import { Config } from '@/infrastructure/config/config-schema';

@Injectable()
export class ThrottlerConfigService {
    constructor(
        private readonly configService: NestConfigService<Config, true>,
    ) {}

    get ttl() {
        return this.configService.get<Config['THROTTLER_DEFAULT_TTL_MS']>(
            'THROTTLER_DEFAULT_TTL_MS',
        );
    }

    get limit() {
        return this.configService.get<Config['THROTTLER_DEFAULT_LIMIT']>(
            'THROTTLER_DEFAULT_LIMIT',
        );
    }

    get useRedis() {
        return this.configService.get<Config['THROTTLER_USE_REDIS']>(
            'THROTTLER_USE_REDIS',
        );
    }
}
