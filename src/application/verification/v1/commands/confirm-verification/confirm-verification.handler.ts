import { Logger } from '@nestjs/common';
import {
    CommandBus,
    CommandHandler,
    EventBus,
    ICommandHandler,
    QueryBus,
} from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';

import { V1UpdateUserCommandHandler } from '@/application/user/v1/commands/update-user/update-user.handler';
import { V1FindUserByIDQueryHandler } from '@/application/user/v1/queries/find-user-by-id/find-user-by-id.handler';
import { VerifyEmailTokenPayload } from '@/domain/jwt/verify-email-token-payload.type';
import { User } from '@/domain/user/user.entity';
import { OnVerificationConfirmedEvent } from '@/domain/verification/events/on-verification-confirmed.event';
import { GenericUnauthenticatedException } from '@/shared/exceptions/unauthenticated.exception';

import { V1ConfirmVerificationCommand } from './confirm-verification.command';

interface V1ConfirmVerificationCommandHandlerResponse {
    user: User;
}

@CommandHandler(V1ConfirmVerificationCommand)
export class V1ConfirmVerificationCommandHandler
    implements
        ICommandHandler<
            V1ConfirmVerificationCommand,
            V1ConfirmVerificationCommandHandlerResponse
        >
{
    private readonly logger = new Logger(
        V1ConfirmVerificationCommandHandler.name,
    );

    constructor(
        private readonly jwtService: JwtService,
        private readonly eventBus: EventBus,
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    static runHandler(
        bus: CommandBus,
        command: V1ConfirmVerificationCommand,
    ): Promise<V1ConfirmVerificationCommandHandlerResponse> {
        return bus.execute<
            V1ConfirmVerificationCommand,
            V1ConfirmVerificationCommandHandlerResponse
        >(new V1ConfirmVerificationCommand(command.verificationToken));
    }

    async execute(
        command: V1ConfirmVerificationCommand,
    ): Promise<V1ConfirmVerificationCommandHandlerResponse> {
        this.logger.log(
            `Confirming verification for ${command.verificationToken}`,
        );

        const payload = await this.jwtService
            .verifyAsync<VerifyEmailTokenPayload>(command.verificationToken)
            .catch(() => {
                this.logger.error('Invalid Token');
                throw new GenericUnauthenticatedException('Invalid Token');
            });

        if (payload.type !== 'verify-email') {
            throw new GenericUnauthenticatedException('Invalid Token Type');
        }

        const user = await V1FindUserByIDQueryHandler.runHandler(
            this.queryBus,
            {
                id: payload.data.sub,
            },
        );

        if (!user) {
            throw new GenericUnauthenticatedException(
                'User not found or Token is invalid',
            );
        }

        user.verifiedAt = new Date();

        await V1UpdateUserCommandHandler.runHandler(this.commandBus, {
            user,
        });

        this.eventBus.publish(new OnVerificationConfirmedEvent(user));

        return Promise.resolve({
            user,
        });
    }
}
