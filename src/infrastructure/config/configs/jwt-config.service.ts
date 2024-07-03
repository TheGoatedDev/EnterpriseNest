import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

import { Config } from '@/infrastructure/config/config-schema';

@Injectable()
export class JwtConfigService {
    constructor(
        private readonly configService: NestConfigService<Config, true>,
    ) {}

    get secret() {
        return this.configService.get<Config['JWT_SECRET']>('JWT_SECRET');
    }
}
