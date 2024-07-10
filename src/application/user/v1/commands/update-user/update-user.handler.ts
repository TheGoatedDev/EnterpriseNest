import { Inject, Logger } from '@nestjs/common';
import type { CommandBus, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler, EventPublisher } from '@nestjs/cqrs';

import { User } from '@/domain/user/user.entity';
import { USER_REPOSITORY } from '@/infrastructure/repositories/modules/user/user.repository.constants';
import type { UserRepositoryPort } from '@/infrastructure/repositories/modules/user/user.repository.port';

import { V1UpdateUserCommand } from './update-user.command';

type V1UpdateUserCommandHandlerResponse = User;

@CommandHandler(V1UpdateUserCommand)
export class V1UpdateUserCommandHandler
    implements
        ICommandHandler<
            V1UpdateUserCommand,
            V1UpdateUserCommandHandlerResponse
        >
{
    private readonly logger = new Logger(V1UpdateUserCommandHandler.name);

    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort,
        private readonly eventPublisher: EventPublisher,
    ) {}

    static runHandler(
        bus: CommandBus,
        command: V1UpdateUserCommand,
    ): Promise<V1UpdateUserCommandHandlerResponse> {
        return bus.execute<
            V1UpdateUserCommand,
            V1UpdateUserCommandHandlerResponse
        >(new V1UpdateUserCommand(command.user));
    }

    async execute({
        user,
    }: V1UpdateUserCommand): Promise<V1UpdateUserCommandHandlerResponse> {
        this.logger.log(`Updating user ${user.id}`);

        const entity = this.eventPublisher.mergeObjectContext(user);

        const updatedEntity = await this.userRepository.update(entity);

        entity.commit();

        return updatedEntity;
    }
}
