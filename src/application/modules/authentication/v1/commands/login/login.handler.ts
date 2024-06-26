import { Logger } from '@nestjs/common';
import type { ICommandHandler } from '@nestjs/cqrs';
import { CommandBus, CommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';

import { V1LoginCommand } from './login.command';

@CommandHandler(V1LoginCommand)
export class V1LoginCommandHandler
    implements ICommandHandler<V1LoginCommand, string>
{
    private readonly logger = new Logger(V1LoginCommandHandler.name);

    constructor(private readonly jwtService: JwtService) {}

    static runHandler(
        bus: CommandBus,
        command: V1LoginCommand,
    ): Promise<string> {
        return bus.execute<V1LoginCommand, string>(
            new V1LoginCommand(command.user, command.ip),
        );
    }

    xecute(command: V1LoginCommand): Promise<string> {
        this.logger.log(
            `User ${command.user.id} has logged in with IP ${command.ip ?? 'unknown'}`,
        );

        // const session = await V1CreateSessionCommandHandler.runHandler(
        //     this.commandBus,
        //     new V1CreateSessionCommand(command.user, command.ip),
        // );

        // return this.jwtService.sign({
        //     sub: command.user.id,
        //     email: command.user.email,
        // });

        return '';
    }
}
