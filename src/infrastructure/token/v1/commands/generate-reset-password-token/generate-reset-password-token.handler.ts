import { Logger } from '@nestjs/common';
import {
    CommandBus,
    CommandHandler,
    EventBus,
    ICommandHandler,
} from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';

import { OnResetPasswordTokenGeneratedEvent } from '@/domain/token/events/on-reset-password-token-generated.event';
import { ResetPasswordTokenPayload } from '@/domain/token/reset-password-token-payload.type';
import { TokenConfigService } from '@/infrastructure/config/configs/token-config.service';

import { V1GenerateResetPasswordTokenCommand } from './generate-reset-password-token.command';

interface V1GenerateResetPasswordTokenCommandHandlerResponse {
    resetPasswordToken: string;
}

@CommandHandler(V1GenerateResetPasswordTokenCommand)
export class V1GenerateResetPasswordTokenCommandHandler
    implements
        ICommandHandler<
            V1GenerateResetPasswordTokenCommand,
            V1GenerateResetPasswordTokenCommandHandlerResponse
        >
{
    private readonly logger = new Logger(
        V1GenerateResetPasswordTokenCommandHandler.name,
    );

    constructor(
        private readonly jwtService: JwtService,
        private readonly eventBus: EventBus,
        private readonly tokenConfigService: TokenConfigService,
    ) {}

    static runHandler(
        bus: CommandBus,
        command: V1GenerateResetPasswordTokenCommand,
    ): Promise<V1GenerateResetPasswordTokenCommandHandlerResponse> {
        return bus.execute<
            V1GenerateResetPasswordTokenCommand,
            V1GenerateResetPasswordTokenCommandHandlerResponse
        >(new V1GenerateResetPasswordTokenCommand(command.user));
    }

    async execute(
        command: V1GenerateResetPasswordTokenCommand,
    ): Promise<V1GenerateResetPasswordTokenCommandHandlerResponse> {
        this.logger.log(
            `Generating Reset Password Token for User ${command.user.id}`,
        );

        const resetPasswordToken = this.jwtService.sign(
            {
                type: 'reset-password',
                data: {
                    sub: command.user.id,
                },
            } satisfies ResetPasswordTokenPayload,
            {
                expiresIn:
                    this.tokenConfigService.resetPasswordTokenExpiration ??
                    '80y',
                algorithm: 'HS512',
                secret: this.tokenConfigService.resetPasswordTokenSecret,
            },
        );

        this.eventBus.publish(
            new OnResetPasswordTokenGeneratedEvent(
                resetPasswordToken,
                command.user,
            ),
        );

        return Promise.resolve({
            resetPasswordToken,
        });
    }
}
