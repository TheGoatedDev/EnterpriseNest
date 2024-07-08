import { Logger } from '@nestjs/common';
import {
    CommandBus,
    CommandHandler,
    EventBus,
    ICommandHandler,
} from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';

import { AccessTokenPayload } from '@/domain/token/access-token-payload.type';
import { OnAccessTokenGeneratedEvent } from '@/domain/token/events/on-access-token-generated.event';
import { TokenConfigService } from '@/infrastructure/config/configs/token-config.service';
import { V1GenerateAccessTokenResponseDto } from '@/infrastructure/token/v1/commands/generate-access-token/dto/generate-access-token.response.dto';

import { V1GenerateAccessTokenCommand } from './generate-access-token.command';

@CommandHandler(V1GenerateAccessTokenCommand)
export class V1GenerateAccessTokenCommandHandler
    implements
        ICommandHandler<
            V1GenerateAccessTokenCommand,
            V1GenerateAccessTokenResponseDto
        >
{
    private readonly logger = new Logger(
        V1GenerateAccessTokenCommandHandler.name,
    );

    constructor(
        private readonly jwtService: JwtService,
        private readonly eventBus: EventBus,
        private readonly tokenConfigService: TokenConfigService,
    ) {}

    static runHandler(
        bus: CommandBus,
        command: V1GenerateAccessTokenCommand,
    ): Promise<V1GenerateAccessTokenResponseDto> {
        return bus.execute<
            V1GenerateAccessTokenCommand,
            V1GenerateAccessTokenResponseDto
        >(
            new V1GenerateAccessTokenCommand(
                command.user,
                command.session,
                command.ip,
            ),
        );
    }

    async execute(
        command: V1GenerateAccessTokenCommand,
    ): Promise<V1GenerateAccessTokenResponseDto> {
        this.logger.log(`Generating Access Token for User ${command.user.id}`);

        const accessToken = this.jwtService.sign(
            {
                type: 'access-token',
                data: {
                    sub: command.user.id,
                    refreshToken: command.session.token,
                    ip: command.ip,
                },
            } satisfies AccessTokenPayload,
            {
                expiresIn:
                    this.tokenConfigService.accessTokenExpiration ?? '80y',
                algorithm: 'HS512',
                secret: this.tokenConfigService.accessTokenSecret,
            },
        );

        this.eventBus.publish(
            new OnAccessTokenGeneratedEvent(
                accessToken,
                command.user,
                command.session,
                command.ip,
            ),
        );

        return Promise.resolve({
            accessToken,
        });
    }
}
