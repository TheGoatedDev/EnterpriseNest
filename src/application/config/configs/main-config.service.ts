import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

import { Config } from '@/application/config/config-schema';

@Injectable()
export class MainConfigService {
    constructor(
        private readonly configService: NestConfigService<Config, true>,
    ) {}

    get NODE_ENV(): Config['NODE_ENV'] {
        return this.configService.get('NODE_ENV');
    }

    get PORT(): Config['PORT'] {
        return this.configService.get('PORT');
    }
}
