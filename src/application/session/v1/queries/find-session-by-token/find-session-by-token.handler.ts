import { Inject, Logger } from '@nestjs/common';
import type { IQueryHandler, QueryBus } from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';

import { Session } from '@/domain/session/session.entity';
import { SESSION_REPOSITORY } from '@/infrastructure/repositories/modules/session/session.repository.constants';
import type { SessionRepositoryPort } from '@/infrastructure/repositories/modules/session/session.repository.port';

import { V1FindSessionByTokenQuery } from './find-session-by-token.query';

type V1FindSessionByTokenQueryHandlerResponse = Session | undefined;

@QueryHandler(V1FindSessionByTokenQuery)
export class V1FindSessionByTokenQueryHandler
    implements
        IQueryHandler<
            V1FindSessionByTokenQuery,
            V1FindSessionByTokenQueryHandlerResponse
        >
{
    private readonly logger = new Logger(V1FindSessionByTokenQueryHandler.name);

    constructor(
        @Inject(SESSION_REPOSITORY)
        private readonly sessionRepository: SessionRepositoryPort,
    ) {}

    static runHandler(
        bus: QueryBus,
        query: V1FindSessionByTokenQuery,
    ): Promise<V1FindSessionByTokenQueryHandlerResponse> {
        return bus.execute<
            V1FindSessionByTokenQuery,
            V1FindSessionByTokenQueryHandlerResponse
        >(new V1FindSessionByTokenQuery(query.refreshToken));
    }

    execute(
        query: V1FindSessionByTokenQuery,
    ): Promise<V1FindSessionByTokenQueryHandlerResponse> {
        this.logger.log(`Finding session by token ${query.refreshToken}`);
        return this.sessionRepository.findOneByToken(query.refreshToken);
    }
}
