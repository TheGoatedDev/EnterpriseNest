import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';

import { AuthenticationConfigService } from '@/infrastructure/config/configs/authentication-config.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
    Strategy,
    'refreshToken',
) {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly authenticationConfig: AuthenticationConfigService,
    ) {
        const options: StrategyOptions = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: authenticationConfig.jwtSecret,
        };

        super(options);
    }

    validate(payload: unknown): Promise<unknown> {
        return Promise.resolve(payload);
    }
}
