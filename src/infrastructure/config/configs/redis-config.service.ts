import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

import { Config } from '@/infrastructure/config/config-schema';

@Injectable()
export class RedisConfigService {
    constructor(
        private readonly configService: NestConfigService<Config, true>,
    ) {}

    get url() {
        return `redis://${this.username}:${this.password}@${this.host}:${this.port.toString()}/${this.db.toString()}`;
    }

    get host() {
        return this.configService.get<Config['REDIS_HOST']>('REDIS_HOST');
    }

    get port() {
        return this.configService.get<Config['REDIS_PORT']>('REDIS_PORT');
    }

    get password() {
        return this.configService.get<Config['REDIS_PASSWORD']>(
            'REDIS_PASSWORD',
        );
    }

    get db() {
        return this.configService.get<Config['REDIS_DB']>('REDIS_DB');
    }

    get username() {
        return this.configService.get<Config['REDIS_USERNAME']>(
            'REDIS_USERNAME',
        );
    }
}
