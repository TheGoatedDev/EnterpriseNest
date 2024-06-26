import { Inject } from '@nestjs/common';
import {
    CommandBus,
    CommandHandler,
    EventBus,
    EventPublisher,
    ICommandHandler,
} from '@nestjs/cqrs';

import { User } from '@/application/modules/user/entity/user.entity';
import { OnUserCreatedEvent } from '@/application/modules/user/events/on-user-created.event';
import type { UserRepositoryPort } from '@/application/modules/user/ports/user-repository.port';
import { USER_REPOSITORY } from '@/application/modules/user/user.constants';

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
        return bus.execute<V1CreateUserCommand, User>(command);
    }

    async execute(command: V1CreateUserCommand): Promise<User> {
        const userEntity = this.eventPublisher.mergeObjectContext(command.user);

        await this.userRepository.create(userEntity);

        this.eventBus.publish(new OnUserCreatedEvent(userEntity));

        userEntity.commit();

        return userEntity;
    }
}
