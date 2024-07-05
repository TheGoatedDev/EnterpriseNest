import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

import { Config } from '@/infrastructure/config/config-schema';

@Injectable()
export class TokenConfigService {
    constructor(
        private readonly configService: NestConfigService<Config, true>,
    ) {}

    get accessTokenSecret() {
        return this.configService.get<Config['TOKEN_ACCESS_SECRET']>(
            'TOKEN_ACCESS_SECRET',
        );
    }

    get refreshTokenSecret() {
        return this.configService.get<Config['TOKEN_REFRESH_SECRET']>(
            'TOKEN_REFRESH_SECRET',
        );
    }

    get verificationTokenSecret() {
        return this.configService.get<Config['TOKEN_VERIFICATION_SECRET']>(
            'TOKEN_VERIFICATION_SECRET',
        );
    }

    get resetPasswordTokenSecret() {
        return this.configService.get<Config['TOKEN_RESET_PASSWORD_SECRET']>(
            'TOKEN_RESET_PASSWORD_SECRET',
        );
    }

    get verificationTokenExpiration() {
        return this.configService.get<
            Config['TOKEN_VERIFICATION_TOKEN_EXPIRATION']
        >('TOKEN_VERIFICATION_TOKEN_EXPIRATION');
    }

    get accessTokenExpiration() {
        return this.configService.get<Config['TOKEN_ACCESS_TOKEN_EXPIRATION']>(
            'TOKEN_ACCESS_TOKEN_EXPIRATION',
        );
    }

    get refreshTokenExpiration() {
        return this.configService.get<Config['TOKEN_REFRESH_TOKEN_EXPIRATION']>(
            'TOKEN_REFRESH_TOKEN_EXPIRATION',
        );
    }

    get resetPasswordTokenExpiration() {
        return this.configService.get<
            Config['TOKEN_RESET_PASSWORD_TOKEN_EXPIRATION']
        >('TOKEN_RESET_PASSWORD_TOKEN_EXPIRATION');
    }
}
