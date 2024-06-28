import { Logger } from '@nestjs/common';
import {
    CommandBus,
    CommandHandler,
    EventBus,
    ICommandHandler,
} from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';

import { OnLoginUserEvent } from '@/domain/authentication/events/on-login-user.event';

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
    ) {}

    static runHandler(
        bus: CommandBus,
        command: V1LoginCommand,
    ): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        return bus.execute<V1LoginCommand, V1LoginCommandHandlerResponse>(
            new V1LoginCommand(command.user, command.ip),
        );
    }

    execute(command: V1LoginCommand): Promise<V1LoginCommandHandlerResponse> {
        this.logger.log(
            `User ${command.user.id} has logged in with IP ${command.ip ?? 'unknown'}`,
        );

        // const session = await V1CreateSessionCommandHandler.runHandler(
        //     this.commandBus,
        //     new V1CreateSessionCommand(command.user, command.ip),
        // );

        const accessToken = this.jwtService.sign(
            {
                sub: command.user.id,
                ip: command.ip,
            },
            {
                expiresIn: '24h',
            },
        );

        const refreshToken = this.jwtService.sign(
            {
                ip: command.ip,
                uuid: 'UNKNOWN', // TODO: Implement UUID for refresh tokens
            },
            {
                expiresIn: '7d',
            },
        );

        this.eventBus.publish(new OnLoginUserEvent(command.user, command.ip));

        return Promise.resolve({
            accessToken,
            refreshToken,
        });
    }
}
