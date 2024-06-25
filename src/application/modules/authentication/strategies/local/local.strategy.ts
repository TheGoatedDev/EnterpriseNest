import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { V1FindUserByEmailQueryHandler } from '@/application/modules/user/v1/queries/find-user-by-email/find-user-by-email.handler';

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
        const user = await V1FindUserByEmailQueryHandler.runHandler(
            this.queryBus,
            {
                email,
            },
        );

        if (!user) {
            return null;
        }

        return user;
    }
}
