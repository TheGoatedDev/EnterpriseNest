import { Inject, Logger } from '@nestjs/common';
import type { CommandBus, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler, EventPublisher } from '@nestjs/cqrs';

import { User } from '@/domain/user/user.entity';
import { USER_REPOSITORY } from '@/infrastructure/repositories/modules/user/user.repository.constants';
import type { UserRepositoryPort } from '@/infrastructure/repositories/modules/user/user.repository.port';

import { V1DeleteUserCommand } from './delete-user.command';

type V1DeleteUserCommandHandlerResponse = User;

@CommandHandler(V1DeleteUserCommand)
export class V1DeleteUserCommandHandler
    implements
        ICommandHandler<
            V1DeleteUserCommand,
            V1DeleteUserCommandHandlerResponse
        >
{
    private readonly logger = new Logger(V1DeleteUserCommandHandler.name);

    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort,
        private readonly eventPublisher: EventPublisher,
    ) {}

    static runHandler(
        bus: CommandBus,
        command: V1DeleteUserCommand,
    ): Promise<V1DeleteUserCommandHandlerResponse> {
        return bus.execute<
            V1DeleteUserCommand,
            V1DeleteUserCommandHandlerResponse
        >(new V1DeleteUserCommand(command.user));
    }

    async execute({
        user,
    }: V1DeleteUserCommand): Promise<V1DeleteUserCommandHandlerResponse> {
        this.logger.log(`Deleting user ${user.id}`);

        const entity = this.eventPublisher.mergeObjectContext(user);

        await this.userRepository.delete(entity);

        entity.commit();

        return entity;
    }
}
