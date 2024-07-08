import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

import { Config } from '@/infrastructure/config/config-schema';

@Injectable()
export class AuthenticationConfigService {
    constructor(
        private readonly configService: NestConfigService<Config, true>,
    ) {}

    get ipStrict() {
        return this.configService.get<Config['AUTH_IP_STRICT']>(
            'AUTH_IP_STRICT',
        );
    }

    get autoVerify() {
        return this.configService.get<Config['AUTH_AUTO_VERIFY']>(
            'AUTH_AUTO_VERIFY',
        );
    }
}
