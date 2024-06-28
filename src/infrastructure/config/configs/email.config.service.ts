import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

import { Config } from '@/infrastructure/config/config-schema';

@Injectable()
export class EmailConfigService {
    constructor(
        private readonly configService: NestConfigService<Config, true>,
    ) {}

    get from() {
        return this.configService.get<Config['EMAIL_FROM']>('EMAIL_FROM');
    }
}
