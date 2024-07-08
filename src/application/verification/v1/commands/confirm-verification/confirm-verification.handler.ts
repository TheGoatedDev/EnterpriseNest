import { Logger } from '@nestjs/common';
import {
    CommandBus,
    CommandHandler,
    EventBus,
    ICommandHandler,
    QueryBus,
} from '@nestjs/cqrs';

import { V1UpdateUserCommandHandler } from '@/application/user/v1/commands/update-user/update-user.handler';
import { OnVerificationConfirmedEvent } from '@/domain/verification/events/on-verification-confirmed.event';
import { V1VerifyVerificationTokenQueryHandler } from '@/infrastructure/token/v1/queries/verify-verification-token/verify-verification-token.handler';

import { V1ConfirmVerificationCommand } from './confirm-verification.command';

type V1ConfirmVerificationCommandHandlerResponse = true;

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

        const { user } = await V1VerifyVerificationTokenQueryHandler.runHandler(
            this.queryBus,
            {
                verificationToken: command.verificationToken,
            },
        );

        user.verifiedAt = new Date();

        await V1UpdateUserCommandHandler.runHandler(this.commandBus, {
            user,
        });

        this.eventBus.publish(new OnVerificationConfirmedEvent(user));

        return Promise.resolve(true);
    }
}
