import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { V1ValidateUserQueryHandler } from '@/application/modules/authentication/v1/queries/validate-user/validate-user.handler';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly queryBus: QueryBus) {
        super({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        });
    }

    async validate(
        request: Express.Request,
        email: string,
        password: string,
    ): Promise<unknown> {
        const user = await V1ValidateUserQueryHandler.runHandler(
            this.queryBus,
            {
                email,
                password,
            },
        );

        return user;
    }
}
