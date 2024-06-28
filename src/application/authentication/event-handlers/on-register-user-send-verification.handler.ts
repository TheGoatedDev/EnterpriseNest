import { Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { V1SendVerificationCommandHandler } from '@/application/verification/v1/commands/send-verification/send-verification.handler';
import { OnRegisterUserEvent } from '@/domain/authentication/events/on-register-user.event';

@EventsHandler(OnRegisterUserEvent)
export class OnRegisterUserSendVerificationHandler
    implements IEventHandler<OnRegisterUserEvent>
{
    private readonly logger = new Logger(
        OnRegisterUserSendVerificationHandler.name,
    );

    constructor(private readonly commandBus: CommandBus) {}

    async handle(event: OnRegisterUserEvent) {
        this.logger.log(
            `Sending verification email to ${event.user.email} as part of registration process`,
        );

        await V1SendVerificationCommandHandler.runHandler(this.commandBus, {
            user: event.user,
        });
    }
}
