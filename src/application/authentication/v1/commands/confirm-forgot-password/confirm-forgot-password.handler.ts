import { Logger } from '@nestjs/common';
import {
    CommandBus,
    CommandHandler,
    EventBus,
    ICommandHandler,
    QueryBus,
} from '@nestjs/cqrs';

import { V1UpdateUserCommandHandler } from '@/application/user/v1/commands/update-user/update-user.handler';
import { OnConfirmForgotPasswordEvent } from '@/domain/authentication/events/on-confirm-forgot-password.event';
import { V1VerifyResetPasswordTokenQueryHandler } from '@/infrastructure/token/v1/queries/verify-reset-password-token/verify-reset-password-token.handler';

import { V1ConfirmForgotPasswordCommand } from './confirm-forgot-password.command';

type V1ConfirmForgotPasswordCommandHandlerResponse = never;

@CommandHandler(V1ConfirmForgotPasswordCommand)
export class V1ConfirmForgotPasswordCommandHandler
    implements
        ICommandHandler<
            V1ConfirmForgotPasswordCommand,
            V1ConfirmForgotPasswordCommandHandlerResponse
        >
{
    private readonly logger = new Logger(
        V1ConfirmForgotPasswordCommandHandler.name,
    );

    constructor(
        private readonly eventBus: EventBus,
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    static runHandler(
        bus: CommandBus,
        command: V1ConfirmForgotPasswordCommand,
    ): Promise<V1ConfirmForgotPasswordCommandHandlerResponse> {
        return bus.execute<
            V1ConfirmForgotPasswordCommand,
            V1ConfirmForgotPasswordCommandHandlerResponse
        >(
            new V1ConfirmForgotPasswordCommand(
                command.resetPasswordToken,
                command.newPassword,
            ),
        );
    }

    async execute(
        command: V1ConfirmForgotPasswordCommand,
    ): Promise<V1ConfirmForgotPasswordCommandHandlerResponse> {
        this.logger.log(
            `Confirming forgot password for token ${command.resetPasswordToken}`,
        );

        const { user } =
            await V1VerifyResetPasswordTokenQueryHandler.runHandler(
                this.queryBus,
                {
                    resetPasswordToken: command.resetPasswordToken,
                },
            );

        user.password = command.newPassword;

        const newUser = await V1UpdateUserCommandHandler.runHandler(
            this.commandBus,
            {
                user,
            },
        );

        this.eventBus.publish(new OnConfirmForgotPasswordEvent(newUser));

        return Promise.resolve(undefined as never);
    }
}
