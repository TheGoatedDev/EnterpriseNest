import { Logger } from '@nestjs/common';
import {
    CommandBus,
    CommandHandler,
    EventBus,
    ICommandHandler,
} from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';

import { OnVerificationTokenGeneratedEvent } from '@/domain/token/events/on-verification-token-generated.event';
import { VerificationTokenPayload } from '@/domain/token/verification-token-payload.type';
import { TokenConfigService } from '@/infrastructure/config/configs/token-config.service';
import { V1GenerateVerificationTokenResponseDto } from '@/infrastructure/token/v1/commands/generate-verification-token/dto/generate-verification-token.response.dto';

import { V1GenerateVerificationTokenCommand } from './generate-verification-token.command';

@CommandHandler(V1GenerateVerificationTokenCommand)
export class V1GenerateVerificationTokenCommandHandler
    implements
        ICommandHandler<
            V1GenerateVerificationTokenCommand,
            V1GenerateVerificationTokenResponseDto
        >
{
    private readonly logger = new Logger(
        V1GenerateVerificationTokenCommandHandler.name,
    );

    constructor(
        private readonly jwtService: JwtService,
        private readonly eventBus: EventBus,
        private readonly tokenConfigService: TokenConfigService,
    ) {}

    static runHandler(
        bus: CommandBus,
        command: V1GenerateVerificationTokenCommand,
    ): Promise<V1GenerateVerificationTokenResponseDto> {
        return bus.execute<
            V1GenerateVerificationTokenCommand,
            V1GenerateVerificationTokenResponseDto
        >(new V1GenerateVerificationTokenCommand(command.user));
    }

    async execute(
        command: V1GenerateVerificationTokenCommand,
    ): Promise<V1GenerateVerificationTokenResponseDto> {
        this.logger.log(
            `Generating Verification Token for User ${command.user.id}`,
        );

        const verificationToken = this.jwtService.sign(
            {
                type: 'verification',
                data: {
                    sub: command.user.id,
                },
            } satisfies VerificationTokenPayload,
            {
                expiresIn: this.tokenConfigService.verificationTokenExpiration,
                algorithm: 'HS512',
                secret: this.tokenConfigService.verificationTokenSecret,
            },
        );

        this.eventBus.publish(
            new OnVerificationTokenGeneratedEvent(
                verificationToken,
                command.user,
            ),
        );

        return Promise.resolve({
            verificationToken,
        });
    }
}
