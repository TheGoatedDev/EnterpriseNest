import { Inject, Logger } from '@nestjs/common';
import {
    CommandBus,
    CommandHandler,
    EventBus,
    ICommandHandler,
} from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';

import { OnVerificationSentEvent } from '@/domain/verification/events/on-verification-sent.event';
import { EmailConfigService } from '@/infrastructure/config/configs/email.config.service';
import { EMAIL } from '@/infrastructure/email/email.constants';
import type { EmailPort } from '@/infrastructure/email/email.port';

import { V1SendVerificationCommand } from './send-verification.command';

interface V1SendVerificationCommandHandlerResponse {
    verificationToken: string;
}

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
        private readonly jwtService: JwtService,
        @Inject(EMAIL)
        private readonly email: EmailPort,
        private readonly eventBus: EventBus,
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

        // const session = await V1CreateSessionCommandHandler.runHandler(
        //     this.commandBus,
        //     new V1CreateSessionCommand(command.user, command.ip),
        // );

        const verificationToken = this.jwtService.sign(
            {
                sub: command.user.id,
            },
            {
                expiresIn: '12h',
            },
        );

        await this.email.sendEmail({
            from: this.emailConfig.from,
            to: command.user.email,

            subject: 'Verify your email address',

            text: `Token: ${verificationToken}`,
            html: `<p>Token: ${verificationToken}</p>`,
        });

        this.eventBus.publish(
            new OnVerificationSentEvent(command.user, verificationToken),
        );

        return Promise.resolve({
            verificationToken,
        });
    }
}
