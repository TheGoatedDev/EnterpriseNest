import { Logger } from '@nestjs/common';
import {
    CommandBus,
    CommandHandler,
    EventBus,
    ICommandHandler,
} from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';

import { OnRefreshTokenGeneratedEvent } from '@/domain/token/events/on-refresh-token-generated.event';
import { RefreshTokenPayload } from '@/domain/token/refresh-token-payload.type';
import { TokenConfigService } from '@/infrastructure/config/configs/token-config.service';

import { V1GenerateRefreshTokenCommand } from './generate-refresh-token.command';

interface V1GenerateRefreshTokenCommandHandlerResponse {
    refreshToken: string;
}

@CommandHandler(V1GenerateRefreshTokenCommand)
export class V1GenerateRefreshTokenCommandHandler
    implements
        ICommandHandler<
            V1GenerateRefreshTokenCommand,
            V1GenerateRefreshTokenCommandHandlerResponse
        >
{
    private readonly logger = new Logger(
        V1GenerateRefreshTokenCommandHandler.name,
    );

    constructor(
        private readonly jwtService: JwtService,
        private readonly eventBus: EventBus,
        private readonly tokenConfigService: TokenConfigService,
    ) {}

    static runHandler(
        bus: CommandBus,
        command: V1GenerateRefreshTokenCommand,
    ): Promise<V1GenerateRefreshTokenCommandHandlerResponse> {
        return bus.execute<
            V1GenerateRefreshTokenCommand,
            V1GenerateRefreshTokenCommandHandlerResponse
        >(
            new V1GenerateRefreshTokenCommand(
                command.user,
                command.session,
                command.ip,
            ),
        );
    }

    async execute(
        command: V1GenerateRefreshTokenCommand,
    ): Promise<V1GenerateRefreshTokenCommandHandlerResponse> {
        this.logger.log(`Generating Refresh Token for User ${command.user.id}`);

        const refreshToken = this.jwtService.sign(
            {
                type: 'refresh-token',
                data: {
                    ip: command.ip,
                    token: command.session.token,
                },
            } satisfies RefreshTokenPayload,
            {
                expiresIn:
                    this.tokenConfigService.refreshTokenExpiration ?? '80y',
                algorithm: 'HS512',
                secret: this.tokenConfigService.refreshTokenSecret,
            },
        );

        this.eventBus.publish(
            new OnRefreshTokenGeneratedEvent(
                refreshToken,
                command.user,
                command.session,
                command.ip,
            ),
        );

        return Promise.resolve({
            refreshToken,
        });
    }
}
