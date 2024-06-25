import { Inject, Logger } from '@nestjs/common';
import type { IQueryHandler, QueryBus } from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';

import type { UserRepositoryPort } from '@/core/entities/user/ports/user-repository.port';
import { USER_REPOSITORY } from '@/core/entities/user/user.constants';
import { User } from '@/core/entities/user/user.entity';

import { V1FindUserByEmailQuery } from './find-user-by-email.query';

@QueryHandler(V1FindUserByEmailQuery)
export class V1FindUserByEmailQueryHandler
    implements IQueryHandler<V1FindUserByEmailQuery, User | undefined>
{
    private readonly logger = new Logger(V1FindUserByEmailQueryHandler.name);

    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort,
    ) {}

    static runHandler(
        bus: QueryBus,
        query: V1FindUserByEmailQuery,
    ): Promise<User | undefined> {
        return bus.execute<V1FindUserByEmailQuery, User | undefined>(
            new V1FindUserByEmailQuery(query.email),
        );
    }

    execute(query: V1FindUserByEmailQuery): Promise<User | undefined> {
        this.logger.debug(
            `Executing FindUserByEmailQueryHandler: ${JSON.stringify(query)}`,
        );

        return this.userRepository.findOneByEmail(query.email);
    }
}
