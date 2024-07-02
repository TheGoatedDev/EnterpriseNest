import { Logger } from '@nestjs/common';
import {
    CommandBus,
    CommandHandler,
    EventBus,
    ICommandHandler,
    QueryBus,
} from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';

import { OnRefreshTokenEvent } from '@/domain/authentication/events/on-refresh-token.event';
import { AccessTokenPayload } from '@/domain/jwt/access-token-payload.type';
import { AuthenticationConfigService } from '@/infrastructure/config/configs/authentication-config.service';

import { V1RefreshTokenCommand } from './refresh-token.command';

interface V1RefreshTokenCommandHandlerResponse {
    accessToken: string;
    refreshToken: string;
}

@CommandHandler(V1RefreshTokenCommand)
export class V1RefreshTokenCommandHandler
    implements
        ICommandHandler<
            V1RefreshTokenCommand,
            V1RefreshTokenCommandHandlerResponse
        >
{
    private readonly logger = new Logger(V1RefreshTokenCommandHandler.name);

    constructor(
        private readonly jwtService: JwtService,
        private readonly eventBus: EventBus,
        private readonly authenticationConfigService: AuthenticationConfigService,
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    static runHandler(
        bus: CommandBus,
        command: V1RefreshTokenCommand,
    ): Promise<V1RefreshTokenCommandHandlerResponse> {
        return bus.execute<
            V1RefreshTokenCommand,
            V1RefreshTokenCommandHandlerResponse
        >(
            new V1RefreshTokenCommand(
                command.user,
                command.refreshToken,
                command.ip,
            ),
        );
    }

    async execute(
        command: V1RefreshTokenCommand,
    ): Promise<V1RefreshTokenCommandHandlerResponse> {
        this.logger.log(
            `User ${command.user.id} has Refreshed Access Token with Refresh Token: ${command.refreshToken}, IP: ${command.ip ?? 'unknown'}`,
        );

        const accessToken = this.jwtService.sign(
            {
                type: 'access-token',
                data: {
                    sub: command.user.id,
                    ip: command.ip,
                    refreshToken: command.refreshToken,
                },
            } satisfies AccessTokenPayload,
            {
                expiresIn:
                    this.authenticationConfigService.accessTokenExpiration,
                algorithm: 'HS512',
                secret: this.authenticationConfigService.jwtAccessSecret,
            },
        );

        this.eventBus.publish(
            new OnRefreshTokenEvent(
                command.user,
                command.refreshToken,
                accessToken,
            ),
        );

        return Promise.resolve({
            accessToken,
            refreshToken: command.refreshToken,
        });
    }
}
