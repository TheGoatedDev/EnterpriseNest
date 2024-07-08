import { Logger } from '@nestjs/common';
import {
    CommandBus,
    CommandHandler,
    EventBus,
    EventPublisher,
    ICommandHandler,
} from '@nestjs/cqrs';

import { V1RegisterResponseDto } from '@/application/authentication/v1/commands/register/dto/register.response.dto';
import { V1CreateUserCommandHandler } from '@/application/user/v1/commands/create-user/create-user.handler';
import { OnRegisterEvent } from '@/domain/authentication/events/on-register.event';
import { AuthenticationConfigService } from '@/infrastructure/config/configs/authentication-config.service';

import { V1RegisterCommand } from './register.command';

type V1RegisterCommandHandlerResponse = V1RegisterResponseDto;

@CommandHandler(V1RegisterCommand)
export class V1RegisterCommandHandler
    implements
        ICommandHandler<V1RegisterCommand, V1RegisterCommandHandlerResponse>
{
    private readonly logger = new Logger(V1RegisterCommandHandler.name);

    constructor(
        private readonly commandBus: CommandBus,
        private readonly eventBus: EventBus,

        private readonly eventPublisher: EventPublisher,

        private readonly authenticationConfigService: AuthenticationConfigService,
    ) {}

    static runHandler(
        bus: CommandBus,
        command: V1RegisterCommand,
    ): Promise<V1RegisterCommandHandlerResponse> {
        return bus.execute<V1RegisterCommand, V1RegisterCommandHandlerResponse>(
            new V1RegisterCommand(command.user, command.ip),
        );
    }

    async execute(
        command: V1RegisterCommand,
    ): Promise<V1RegisterCommandHandlerResponse> {
        this.logger.log(
            `User ${command.user.id} has registered in with IP ${command.ip ?? 'unknown'}`,
        );

        if (this.authenticationConfigService.autoVerify) {
            command.user.verifiedAt = new Date();
        }

        const user = this.eventPublisher.mergeObjectContext(command.user);

        const createdUser = await V1CreateUserCommandHandler.runHandler(
            this.commandBus,
            {
                user,
            },
        );

        this.eventBus.publish(new OnRegisterEvent(createdUser, command.ip));

        user.commit();

        return Promise.resolve({
            user: createdUser,
            verificationRequired: !createdUser.verifiedAt,
        });
    }
}
