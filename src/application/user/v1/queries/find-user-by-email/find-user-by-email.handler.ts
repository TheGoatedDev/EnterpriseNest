import { Inject, Logger } from '@nestjs/common';
import type { IQueryHandler, QueryBus } from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';

import { User } from '@/domain/user/user.entity';
import { USER_REPOSITORY } from '@/infrastructure/repositories/modules/user/user.repository.constants';
import type { UserRepositoryPort } from '@/infrastructure/repositories/modules/user/user.repository.port';

import { V1FindUserByEmailQuery } from './find-user-by-email.query';

type V1FindUserByEmailQueryHandlerResponse = User | undefined;

@QueryHandler(V1FindUserByEmailQuery)
export class V1FindUserByEmailQueryHandler
    implements
        IQueryHandler<
            V1FindUserByEmailQuery,
            V1FindUserByEmailQueryHandlerResponse
        >
{
    private readonly logger = new Logger(V1FindUserByEmailQueryHandler.name);

    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort,
    ) {}

    static runHandler(
        bus: QueryBus,
        query: V1FindUserByEmailQuery,
    ): Promise<V1FindUserByEmailQueryHandlerResponse> {
        return bus.execute<
            V1FindUserByEmailQuery,
            V1FindUserByEmailQueryHandlerResponse
        >(new V1FindUserByEmailQuery(query.email));
    }

    execute(
        query: V1FindUserByEmailQuery,
    ): Promise<V1FindUserByEmailQueryHandlerResponse> {
        this.logger.log(`Finding user by email ${query.email}`);
        return this.userRepository.findOneByEmail(query.email);
    }
}
