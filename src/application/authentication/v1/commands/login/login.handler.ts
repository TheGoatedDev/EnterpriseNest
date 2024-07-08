import { Logger } from '@nestjs/common';
import {
    CommandBus,
    CommandHandler,
    EventBus,
    ICommandHandler,
} from '@nestjs/cqrs';

import { V1LoginResponseDto } from '@/application/authentication/v1/commands/login/dto/login.response.dto';
import { V1CreateSessionCommandHandler } from '@/application/session/v1/commands/create-session/create-session.handler';
import { OnLoginEvent } from '@/domain/authentication/events/on-login.event';
import { V1GenerateAccessTokenCommandHandler } from '@/infrastructure/token/v1/commands/generate-access-token/generate-access-token.handler';
import { V1GenerateRefreshTokenCommandHandler } from '@/infrastructure/token/v1/commands/generate-refresh-token/generate-refresh-token.handler';

import { V1LoginCommand } from './login.command';

type V1LoginCommandHandlerResponse = V1LoginResponseDto;

@CommandHandler(V1LoginCommand)
export class V1LoginCommandHandler
    implements ICommandHandler<V1LoginCommand, V1LoginCommandHandlerResponse>
{
    private readonly logger = new Logger(V1LoginCommandHandler.name);

    constructor(
        private readonly eventBus: EventBus,
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

        const generatedAccessToken =
            await V1GenerateAccessTokenCommandHandler.runHandler(
                this.commandBus,
                {
                    user: command.user,
                    session,
                    ip: command.ip,
                },
            );

        const generatedRefreshToken =
            await V1GenerateRefreshTokenCommandHandler.runHandler(
                this.commandBus,
                {
                    user: command.user,
                    session,
                    ip: command.ip,
                },
            );

        this.eventBus.publish(new OnLoginEvent(command.user, command.ip));

        return Promise.resolve({
            accessToken: generatedAccessToken.accessToken,
            refreshToken: generatedRefreshToken.refreshToken,
        });
    }
}
