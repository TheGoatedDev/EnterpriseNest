import { Injectable, UnauthorizedException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';

import { RefreshTokenPayload } from '@/domain/authentication/refresh-token-payload.type';
import { User } from '@/domain/user/user.entity';
import { AuthenticationConfigService } from '@/infrastructure/config/configs/authentication-config.service';
import { RequestWithUser } from '@/types/express/request-with-user';

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

    validate(
        request: RequestWithUser,
        payload: RefreshTokenPayload,
    ): Promise<User> {
        if (!payload.uuid) {
            throw new UnauthorizedException(
                'Invalid Access Token: Missing User ID',
            );
        }

        if (!payload.ip || payload.ip !== request.ip) {
            throw new UnauthorizedException(
                'Invalid Access Token: IP Mismatch',
            );
        }

        // TODO: Implement the query handler to find the user by the UUID of the refresh token
        throw new Error('Method not implemented.');

        // return Promise.resolve(user);
    }
}
