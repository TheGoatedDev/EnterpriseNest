import { Injectable, UnauthorizedException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthenticationNoEmailMatchException } from '@/application/authentication/exceptions/no-email-match.exception';
import { AuthenticationPasswordIncorrectException } from '@/application/authentication/exceptions/password-incorrect.exception';
import { V1ValidateCredentialsQueryHandler } from '@/application/authentication/v1/queries/validate-credentials/validate-credentials.handler';

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
        const user = await V1ValidateCredentialsQueryHandler.runHandler(
            this.queryBus,
            {
                email,
                password,
            },
        ).catch((error: unknown) => {
            if (
                error instanceof AuthenticationNoEmailMatchException ||
                error instanceof AuthenticationPasswordIncorrectException
            ) {
                throw new UnauthorizedException(
                    "Email or password doesn't match",
                );
            }

            throw error;
        });

        return user;
    }
}
