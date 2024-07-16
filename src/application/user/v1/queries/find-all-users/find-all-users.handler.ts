import { Inject, Logger } from '@nestjs/common';
import type { IQueryHandler, QueryBus } from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';

import { User } from '@/domain/user/user.entity';
import { USER_REPOSITORY } from '@/infrastructure/repositories/modules/user/user.repository.constants';
import type { UserRepositoryPort } from '@/infrastructure/repositories/modules/user/user.repository.port';

import { V1FindAllUsersQuery } from './find-all-users.query';

type V1FindAllUsersQueryHandlerResponse = User[];

@QueryHandler(V1FindAllUsersQuery)
export class V1FindAllUsersQueryHandler
    implements
        IQueryHandler<V1FindAllUsersQuery, V1FindAllUsersQueryHandlerResponse>
{
    private readonly logger = new Logger(V1FindAllUsersQueryHandler.name);

    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort,
    ) {}

    static runHandler(
        bus: QueryBus,
    ): Promise<V1FindAllUsersQueryHandlerResponse> {
        return bus.execute<
            V1FindAllUsersQuery,
            V1FindAllUsersQueryHandlerResponse
        >(new V1FindAllUsersQuery());
    }

    execute(
        query: V1FindAllUsersQuery,
    ): Promise<V1FindAllUsersQueryHandlerResponse> {
        this.logger.log(`Finding all users`);

        return this.userRepository.findAll();
    }
}
