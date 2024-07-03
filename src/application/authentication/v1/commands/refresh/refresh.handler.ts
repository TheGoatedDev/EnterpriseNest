import { Logger } from '@nestjs/common';
import {
    CommandBus,
    CommandHandler,
    EventBus,
    ICommandHandler,
} from '@nestjs/cqrs';

import { V1RefreshTokenResponseDto } from '@/application/authentication/v1/commands/refresh/dto/refresh.response.dto';
import { OnRefreshTokenEvent } from '@/domain/authentication/events/on-refresh-token.event';
import { V1GenerateAccessTokenCommandHandler } from '@/infrastructure/token/v1/commands/generate-access-token/generate-access-token.handler';

import { V1RefreshTokenCommand } from './refresh.command';

@CommandHandler(V1RefreshTokenCommand)
export class V1RefreshTokenCommandHandler
    implements
        ICommandHandler<V1RefreshTokenCommand, V1RefreshTokenResponseDto>
{
    private readonly logger = new Logger(V1RefreshTokenCommandHandler.name);

    constructor(
        private readonly eventBus: EventBus,
        private readonly commandBus: CommandBus,
    ) {}

    static runHandler(
        bus: CommandBus,
        command: V1RefreshTokenCommand,
    ): Promise<V1RefreshTokenResponseDto> {
        return bus.execute<V1RefreshTokenCommand, V1RefreshTokenResponseDto>(
            new V1RefreshTokenCommand(
                command.user,
                command.session,
                command.ip,
            ),
        );
    }

    async execute(
        command: V1RefreshTokenCommand,
    ): Promise<V1RefreshTokenResponseDto> {
        this.logger.log(
            `User ${command.user.id} has Refreshed Access Token with Session: ${command.session.id}, IP: ${command.ip ?? 'unknown'}`,
        );

        const accessToken =
            await V1GenerateAccessTokenCommandHandler.runHandler(
                this.commandBus,
                {
                    user: command.user,
                    session: command.session,
                    ip: command.ip,
                },
            );

        this.eventBus.publish(
            new OnRefreshTokenEvent(
                command.user,
                command.session,
                accessToken.accessToken,
            ),
        );

        return Promise.resolve({
            accessToken: accessToken.accessToken,
        });
    }
}
