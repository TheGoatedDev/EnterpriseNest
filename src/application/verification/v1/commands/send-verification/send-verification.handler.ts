import { Inject, Logger } from '@nestjs/common';
import {
    CommandBus,
    CommandHandler,
    EventBus,
    ICommandHandler,
} from '@nestjs/cqrs';

import { OnVerificationSentEvent } from '@/domain/verification/events/on-verification-sent.event';
import { EmailConfigService } from '@/infrastructure/config/configs/email.config.service';
import { MAILER } from '@/infrastructure/mailer/mailer.constants';
import type { MailerPort } from '@/infrastructure/mailer/mailer.port';
import { V1GenerateVerificationTokenCommandHandler } from '@/infrastructure/token/v1/commands/generate-verification-token/generate-verification-token.handler';

import { V1SendVerificationCommand } from './send-verification.command';

type V1SendVerificationCommandHandlerResponse = true;

@CommandHandler(V1SendVerificationCommand)
export class V1SendVerificationCommandHandler
    implements
        ICommandHandler<
            V1SendVerificationCommand,
            V1SendVerificationCommandHandlerResponse
        >
{
    private readonly logger = new Logger(V1SendVerificationCommandHandler.name);

    constructor(
        @Inject(MAILER)
        private readonly mailer: MailerPort,
        private readonly eventBus: EventBus,
        private readonly commandBus: CommandBus,
        private readonly emailConfig: EmailConfigService,
    ) {}

    static runHandler(
        bus: CommandBus,
        command: V1SendVerificationCommand,
    ): Promise<V1SendVerificationCommandHandlerResponse> {
        return bus.execute<
            V1SendVerificationCommand,
            V1SendVerificationCommandHandlerResponse
        >(new V1SendVerificationCommand(command.user));
    }

    async execute(
        command: V1SendVerificationCommand,
    ): Promise<V1SendVerificationCommandHandlerResponse> {
        this.logger.log(
            `Sending verification email to ${command.user.email} with verification token`,
        );

        const generateVerificationToken =
            await V1GenerateVerificationTokenCommandHandler.runHandler(
                this.commandBus,
                {
                    user: command.user,
                },
            );

        // TODO: Implement email template
        await this.mailer.sendEmail({
            from: this.emailConfig.from,
            to: command.user.email,

            subject: 'Verify your email address',

            text: `Token: ${generateVerificationToken.verificationToken}`,
            html: `<p>Token: ${generateVerificationToken.verificationToken}</p>`,
        });

        this.eventBus.publish(
            new OnVerificationSentEvent(
                command.user,
                generateVerificationToken.verificationToken,
            ),
        );

        return Promise.resolve(true);
    }
}
