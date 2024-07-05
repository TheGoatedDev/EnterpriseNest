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
import { V1GenerateResetPasswordTokenResponseDto } from '@/infrastructure/token/v1/commands/generate-reset-password-token/dto/generate-reset-password-token.response.dto';

import { V1GenerateResetPasswordTokenCommand } from './generate-reset-password-token.command';

@CommandHandler(V1GenerateResetPasswordTokenCommand)
export class V1GenerateResetPasswordTokenCommandHandler
    implements
        ICommandHandler<
            V1GenerateResetPasswordTokenCommand,
            V1GenerateResetPasswordTokenResponseDto
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
    ): Promise<V1GenerateResetPasswordTokenResponseDto> {
        return bus.execute<
            V1GenerateResetPasswordTokenCommand,
            V1GenerateResetPasswordTokenResponseDto
        >(new V1GenerateResetPasswordTokenCommand(command.user));
    }

    async execute(
        command: V1GenerateResetPasswordTokenCommand,
    ): Promise<V1GenerateResetPasswordTokenResponseDto> {
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
                expiresIn: this.tokenConfigService.resetPasswordTokenExpiration,
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
