import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EventBus, QueryBus } from '@nestjs/cqrs';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthenticationNoEmailMatchException } from '@/application/authentication/exceptions/no-email-match.exception';
import { AuthenticationPasswordIncorrectException } from '@/application/authentication/exceptions/password-incorrect.exception';
import { V1ValidateCredentialsQueryHandler } from '@/application/authentication/v1/queries/validate-credentials/validate-credentials.handler';
import { OnUserUnverifiedEvent } from '@/domain/authentication/events/on-user-unverified.event';
import { RequestWithUser } from '@/types/express/request-with-user';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly eventBus: EventBus,
    ) {
        super({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        });
    }

    async validate(
        request: RequestWithUser,
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

        if (!user.verifiedAt) {
            this.eventBus.publish(new OnUserUnverifiedEvent(user, request.ip));
            throw new UnauthorizedException('User is not verified');
        }

        return user;
    }
}
