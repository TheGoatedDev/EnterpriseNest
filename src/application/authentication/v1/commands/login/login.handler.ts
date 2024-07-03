import { Logger } from '@nestjs/common';
import {
    CommandBus,
    CommandHandler,
    EventBus,
    ICommandHandler,
} from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';

import { V1CreateSessionCommandHandler } from '@/application/session/v1/commands/create-session/create-session.handler';
import { OnLoginUserEvent } from '@/domain/authentication/events/on-login-user.event';
import { AccessTokenPayload } from '@/domain/token/access-token-payload.type';
import { RefreshTokenPayload } from '@/domain/token/refresh-token-payload.type';
import { AuthenticationConfigService } from '@/infrastructure/config/configs/authentication-config.service';

import { V1LoginCommand } from './login.command';

interface V1LoginCommandHandlerResponse {
    accessToken: string;
    refreshToken: string;
}

@CommandHandler(V1LoginCommand)
export class V1LoginCommandHandler
    implements ICommandHandler<V1LoginCommand, V1LoginCommandHandlerResponse>
{
    private readonly logger = new Logger(V1LoginCommandHandler.name);

    constructor(
        private readonly jwtService: JwtService,
        private readonly eventBus: EventBus,
        private readonly authenticationConfigService: AuthenticationConfigService,
        private readonly commandBus: CommandBus,
    ) {}

    static runHandler(
        bus: CommandBus,
        command: V1LoginCommand,
    ): Promise<V1LoginCommandHandlerResponse> {
        return bus.execute<V1LoginCommand, V1LoginCommandHandlerResponse>(
            new V1LoginCommand(command.user, command.ip),
        );
    }

    async execute(
        command: V1LoginCommand,
    ): Promise<V1LoginCommandHandlerResponse> {
        this.logger.log(
            `User ${command.user.id} has logged in with IP ${command.ip ?? 'unknown'}`,
        );

        const session = await V1CreateSessionCommandHandler.runHandler(
            this.commandBus,
            {
                user: command.user,
                ip: command.ip,
            },
        );

        const accessToken = this.jwtService.sign(
            {
                type: 'access-token',
                data: {
                    sub: command.user.id,
                    refreshToken: session.token,
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

        const refreshToken = this.jwtService.sign(
            {
                type: 'refresh-token',
                data: {
                    ip: command.ip,
                    token: session.token,
                },
            } satisfies RefreshTokenPayload,
            {
                expiresIn:
                    this.authenticationConfigService.refreshTokenExpiration,
                algorithm: 'HS512',
                secret: this.authenticationConfigService.jwtRefreshSecret,
            },
        );

        this.eventBus.publish(new OnLoginUserEvent(command.user, command.ip));

        return Promise.resolve({
            accessToken,
            refreshToken,
        });
    }
}
