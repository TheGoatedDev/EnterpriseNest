import { Inject, Logger } from '@nestjs/common';
import {
    CommandBus,
    CommandHandler,
    EventBus,
    ICommandHandler,
} from '@nestjs/cqrs';

import { OnForgotPasswordEvent } from '@/domain/authentication/events/on-forgot-password.event';
import { EmailConfigService } from '@/infrastructure/config/configs/email.config.service';
import { MAILER } from '@/infrastructure/mailer/mailer.constants';
import type { MailerPort } from '@/infrastructure/mailer/mailer.port';
import { V1GenerateResetPasswordTokenCommandHandler } from '@/infrastructure/token/v1/commands/generate-reset-password-token/generate-reset-password-token.handler';

import { V1ForgotPasswordCommand } from './forgot-password.command';

interface V1ForgotPasswordCommandHandlerResponse {
    resetPasswordToken: string;
}

@CommandHandler(V1ForgotPasswordCommand)
export class V1ForgotPasswordCommandHandler
    implements
        ICommandHandler<
            V1ForgotPasswordCommand,
            V1ForgotPasswordCommandHandlerResponse
        >
{
    private readonly logger = new Logger(V1ForgotPasswordCommandHandler.name);

    constructor(
        @Inject(MAILER)
        private readonly mailer: MailerPort,
        private readonly eventBus: EventBus,
        private readonly emailConfig: EmailConfigService,
        private readonly commandBus: CommandBus,
    ) {}

    static runHandler(
        bus: CommandBus,
        command: V1ForgotPasswordCommand,
    ): Promise<V1ForgotPasswordCommandHandlerResponse> {
        return bus.execute<
            V1ForgotPasswordCommand,
            V1ForgotPasswordCommandHandlerResponse
        >(new V1ForgotPasswordCommand(command.user, command.ip));
    }

    async execute(
        command: V1ForgotPasswordCommand,
    ): Promise<V1ForgotPasswordCommandHandlerResponse> {
        this.logger.log(
            `Sending forgot password email to ${command.user.email} with reset password token and IP: ${command.ip ?? 'UNKNOWN'}`,
        );

        const generatedResetPasswordToken =
            await V1GenerateResetPasswordTokenCommandHandler.runHandler(
                this.commandBus,
                {
                    user: command.user,
                },
            );

        // TODO: Implement email template
        await this.mailer.sendEmail({
            from: this.emailConfig.from,
            to: command.user.email,

            subject: 'Reset your password',

            text: `Token: ${generatedResetPasswordToken.resetPasswordToken}`,
            html: `<p>Token: ${generatedResetPasswordToken.resetPasswordToken}</p>`,
        });

        this.eventBus.publish(
            new OnForgotPasswordEvent(
                command.user,
                generatedResetPasswordToken.resetPasswordToken,
                command.ip,
            ),
        );

        return Promise.resolve({
            resetPasswordToken: generatedResetPasswordToken.resetPasswordToken,
        });
    }
}
