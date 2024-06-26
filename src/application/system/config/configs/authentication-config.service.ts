import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

import { Config } from '@/application/system/config/config-schema';

@Injectable()
export class AuthenticationConfigService {
    constructor(
        private readonly configService: NestConfigService<Config, true>,
    ) {}

    get jwtSecret() {
        return this.configService.get<Config['AUTH_JWT_SECRET']>(
            'AUTH_JWT_SECRET',
        );
    }

    get accessTokenExpiration() {
        return this.configService.get<Config['AUTH_ACCESS_TOKEN_EXPIRATION']>(
            'AUTH_ACCESS_TOKEN_EXPIRATION',
        );
    }

    get refreshTokenExpiration() {
        return this.configService.get<Config['AUTH_REFRESH_TOKEN_EXPIRATION']>(
            'AUTH_REFRESH_TOKEN_EXPIRATION',
        );
    }
}
