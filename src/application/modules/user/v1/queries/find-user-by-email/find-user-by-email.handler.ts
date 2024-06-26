import { Inject, Logger } from '@nestjs/common';
import type { IQueryHandler, QueryBus } from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';

import { User } from '@/application/modules/user/entity/user.entity';
import type { UserRepositoryPort } from '@/application/modules/user/ports/user-repository.port';
import { USER_REPOSITORY } from '@/application/modules/user/user.constants';

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
