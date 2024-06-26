import { Logger } from '@nestjs/common';
import type { ICommandHandler } from '@nestjs/cqrs';
import { CommandBus, CommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';

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

    constructor(private readonly jwtService: JwtService) {}

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
            },
            {
                expiresIn: '24h',
            },
        );

        return Promise.resolve({
            accessToken,
            refreshToken: 'refresh-token',
        });
    }
}
