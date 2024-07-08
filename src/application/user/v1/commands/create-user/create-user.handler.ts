import { Inject, Logger } from '@nestjs/common';
import {
    CommandBus,
    CommandHandler,
    EventBus,
    EventPublisher,
    ICommandHandler,
} from '@nestjs/cqrs';

import { OnUserCreatedEvent } from '@/domain/user/events/on-user-created.event';
import { User } from '@/domain/user/user.entity';
import { USER_REPOSITORY } from '@/infrastructure/repositories/modules/user/user.repository.constants';
import type { UserRepositoryPort } from '@/infrastructure/repositories/modules/user/user.repository.port';

import { V1CreateUserCommand } from './create-user.command';

type V1CreateUserCommandHandlerResponse = User;

@CommandHandler(V1CreateUserCommand)
export class V1CreateUserCommandHandler
    implements
        ICommandHandler<
            V1CreateUserCommand,
            V1CreateUserCommandHandlerResponse
        >
{
    private readonly logger = new Logger(V1CreateUserCommandHandler.name);

    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort,
        private readonly eventPublisher: EventPublisher,
        private readonly eventBus: EventBus,
    ) {}

    static runHandler(
        bus: CommandBus,
        command: V1CreateUserCommand,
    ): Promise<V1CreateUserCommandHandlerResponse> {
        return bus.execute<
            V1CreateUserCommand,
            V1CreateUserCommandHandlerResponse
        >(new V1CreateUserCommand(command.user));
    }

    async execute(
        command: V1CreateUserCommand,
    ): Promise<V1CreateUserCommandHandlerResponse> {
        this.logger.log(`Creating user ${command.user.email}`);

        const userEntity = this.eventPublisher.mergeObjectContext(command.user);

        await this.userRepository.create(userEntity);

        this.eventBus.publish(new OnUserCreatedEvent(userEntity));

        userEntity.commit();

        return userEntity;
    }
}
