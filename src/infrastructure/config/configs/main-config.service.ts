import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

import { Config } from '@/infrastructure/config/config-schema';

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

    get APP_NAME(): Config['APP_NAME'] {
        return this.configService.get('APP_NAME');
    }

    get BEHIND_PROXY(): Config['BEHIND_PROXY'] {
        return this.configService.get('BEHIND_PROXY');
    }

    get DEBUG(): Config['DEBUG'] {
        return this.configService.get('DEBUG');
    }
}
