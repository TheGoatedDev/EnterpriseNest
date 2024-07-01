import { Logger } from '@nestjs/common';
import {
    CommandBus,
    CommandHandler,
    EventBus,
    ICommandHandler,
    QueryBus,
} from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';

import { V1FindSessionByTokenQueryHandler } from '@/application/session/v1/queries/find-session-by-token/find-session-by-token.handler';
import { V1FindUserByIDQueryHandler } from '@/application/user/v1/queries/find-user-by-id/find-user-by-id.handler';
import { OnRefreshTokenEvent } from '@/domain/authentication/events/on-refresh-token.event';
import { AccessTokenPayload } from '@/domain/jwt/access-token-payload.type';
import { AuthenticationConfigService } from '@/infrastructure/config/configs/authentication-config.service';
import { GenericNotFoundException } from '@/shared/exceptions/not-found.exception';

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
    ): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        return bus.execute<
            V1RefreshTokenCommand,
            V1RefreshTokenCommandHandlerResponse
        >(new V1RefreshTokenCommand(command.refreshToken, command.ip));
    }

    async execute(
        command: V1RefreshTokenCommand,
    ): Promise<V1RefreshTokenCommandHandlerResponse> {
        this.logger.log(
            `Session ${command.refreshToken} has Refreshed Access Token with IP ${command.ip ?? 'unknown'}`,
        );

        const session = await V1FindSessionByTokenQueryHandler.runHandler(
            this.queryBus,
            {
                refreshToken: command.refreshToken,
            },
        );

        if (!session) {
            throw new GenericNotFoundException('Session not found');
        }

        const user = await V1FindUserByIDQueryHandler.runHandler(
            this.queryBus,
            {
                id: session.userId,
            },
        );

        if (!user) {
            throw new GenericNotFoundException('User not found');
        }

        const accessToken = this.jwtService.sign(
            {
                type: 'access-token',
                data: {
                    sub: session.userId,
                    ip: command.ip,
                },
            } satisfies AccessTokenPayload,
            {
                expiresIn:
                    this.authenticationConfigService.accessTokenExpiration,
                algorithm: 'HS512',
                secret: this.authenticationConfigService.jwtAccessSecret,
            },
        );

        this.eventBus.publish(new OnRefreshTokenEvent(user));

        return Promise.resolve({
            accessToken,
            refreshToken: command.refreshToken,
        });
    }
}
