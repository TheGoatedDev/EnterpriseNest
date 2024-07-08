import { Injectable } from '@nestjs/common';
import { EventBus, QueryBus } from '@nestjs/cqrs';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { V1ValidateCredentialsQueryHandler } from '@/application/authentication/v1/queries/validate-credentials/validate-credentials.handler';
import { OnLoginUnverifiedEvent } from '@/domain/authentication/events/on-login-unverified.event';
import { AuthenticationNoEmailMatchException } from '@/domain/authentication/exceptions/no-email-match.exception';
import { AuthenticationPasswordIncorrectException } from '@/domain/authentication/exceptions/password-incorrect.exception';
import { GenericNoPermissionException } from '@/shared/exceptions/no-permission.exception';
import { GenericUnauthenticatedException } from '@/shared/exceptions/unauthenticated.exception';
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
                throw new GenericUnauthenticatedException(
                    "Email or password doesn't match",
                );
            }

            throw error;
        });

        if (!user.verifiedAt) {
            this.eventBus.publish(new OnLoginUnverifiedEvent(user, request.ip));
            throw new GenericNoPermissionException('User is not verified');
        }

        return user;
    }
}
