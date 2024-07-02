import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';

import { V1FindUserByIDQueryHandler } from '@/application/user/v1/queries/find-user-by-id/find-user-by-id.handler';
import { AccessTokenPayload } from '@/domain/jwt/access-token-payload.type';
import { User } from '@/domain/user/user.entity';
import { AuthenticationConfigService } from '@/infrastructure/config/configs/authentication-config.service';
import { RequestWithUser } from '@/types/express/request-with-user';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
    Strategy,
    'accessToken',
) {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly authenticationConfig: AuthenticationConfigService,
    ) {
        const options: StrategyOptions = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: authenticationConfig.jwtAccessSecret,
            algorithms: ['HS256', 'HS384', 'HS512'],
            passReqToCallback: true,
        };

        super(options);
    }

    async validate(
        request: RequestWithUser,
        payload: AccessTokenPayload,
    ): Promise<User> {
        if (payload.type !== 'access-token') {
            throw new BadRequestException(
                'Invalid Access Token: Invalid Token Type',
            );
        }

        if (!payload.data.sub) {
            throw new BadRequestException(
                'Invalid Access Token: Missing User ID',
            );
        }

        if (!payload.data.ip || payload.data.ip !== request.ip) {
            throw new UnauthorizedException(
                'Invalid Access Token: IP Mismatch',
            );
        }

        const user = await V1FindUserByIDQueryHandler.runHandler(
            this.queryBus,
            {
                id: payload.data.sub,
            },
        );

        if (!user) {
            throw new UnauthorizedException(
                'Invalid Access Token: User Not Found',
            );
        }

        if (!user.verifiedAt) {
            throw new UnauthorizedException(
                'Invalid Access Token: User Not Verified',
            );
        }

        return Promise.resolve(user);
    }
}
