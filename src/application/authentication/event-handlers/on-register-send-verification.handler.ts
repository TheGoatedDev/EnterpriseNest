import { Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { V1SendVerificationCommandHandler } from '@/application/verification/v1/commands/send-verification/send-verification.handler';
import { OnRegisterEvent } from '@/domain/authentication/events/on-register.event';

@EventsHandler(OnRegisterEvent)
export class OnRegisterSendVerificationHandler
    implements IEventHandler<OnRegisterEvent>
{
    private readonly logger = new Logger(
        OnRegisterSendVerificationHandler.name,
    );

    constructor(private readonly commandBus: CommandBus) {}

    async handle(event: OnRegisterEvent) {
        if (event.user.verifiedAt) {
            this.logger.log(
                `User ${event.user.id} has already been verified, skipping verification email`,
            );
            return;
        }

        this.logger.log(
            `Sending verification email to ${event.user.id} as part of registration process`,
        );

        await V1SendVerificationCommandHandler.runHandler(this.commandBus, {
            user: event.user,
        });
    }
}
