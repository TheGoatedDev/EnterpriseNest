import { Inject } from '@nestjs/common';
import {
    CommandBus,
    CommandHandler,
    EventBus,
    EventPublisher,
    ICommandHandler,
} from '@nestjs/cqrs';

import { OnUserCreatedEvent } from '@/domain/user/events/on-user-created.event';
import { User } from '@/domain/user/user.entity';
import { USER_REPOSITORY } from '@/infrastructure/repositories/user/user.repository.constants';
import type { UserRepositoryPort } from '@/infrastructure/repositories/user/user.repository.port';

import { V1CreateUserCommand } from './create-user.command';

@CommandHandler(V1CreateUserCommand)
export class V1CreateUserCommandHandler
    implements ICommandHandler<V1CreateUserCommand, User>
{
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort,
        private readonly eventPublisher: EventPublisher,
        private readonly eventBus: EventBus,
    ) {}

    static runHandler(
        bus: CommandBus,
        command: V1CreateUserCommand,
    ): Promise<User> {
        return bus.execute<V1CreateUserCommand, User>(
            new V1CreateUserCommand(command.user),
        );
    }

    async execute(command: V1CreateUserCommand): Promise<User> {
        const userEntity = this.eventPublisher.mergeObjectContext(command.user);

        await this.userRepository.create(userEntity);

        this.eventBus.publish(new OnUserCreatedEvent(userEntity));

        userEntity.commit();

        return userEntity;
    }
}
