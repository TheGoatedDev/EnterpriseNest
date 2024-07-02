import { Inject, Logger } from '@nestjs/common';
import type { IQueryHandler, QueryBus } from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';

import { User } from '@/domain/user/user.entity';
import { USER_REPOSITORY } from '@/infrastructure/repositories/modules/user/user.repository.constants';
import type { UserRepositoryPort } from '@/infrastructure/repositories/modules/user/user.repository.port';

import { V1FindUserByIDQuery } from './find-user-by-id.query';

@QueryHandler(V1FindUserByIDQuery)
export class V1FindUserByIDQueryHandler
    implements IQueryHandler<V1FindUserByIDQuery, User | undefined>
{
    private readonly logger = new Logger(V1FindUserByIDQueryHandler.name);

    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort,
    ) {}

    static runHandler(
        bus: QueryBus,
        query: V1FindUserByIDQuery,
    ): Promise<User | undefined> {
        return bus.execute<V1FindUserByIDQuery, User | undefined>(
            new V1FindUserByIDQuery(query.id),
        );
    }

    execute(query: V1FindUserByIDQuery): Promise<User | undefined> {
        return this.userRepository.findOneById(query.id);
    }
}
