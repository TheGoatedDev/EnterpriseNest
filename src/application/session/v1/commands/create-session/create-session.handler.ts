import { Inject, Logger } from '@nestjs/common';
import type { CommandBus, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler, EventPublisher, QueryBus } from '@nestjs/cqrs';

import { Session } from '@/domain/session/session.entity';
import { SESSION_REPOSITORY } from '@/infrastructure/repositories/modules/session/session.repository.constants';
import type { SessionRepositoryPort } from '@/infrastructure/repositories/modules/session/session.repository.port';
import { GenericNotFoundException } from '@/shared/exceptions/not-found.exception';

import { V1FindUserByIDQueryHandler } from '../../../../user/v1/queries/find-user-by-id/find-user-by-id.handler';
import { V1FindUserByIDQuery } from '../../../../user/v1/queries/find-user-by-id/find-user-by-id.query';
import { V1CreateSessionCommand } from './create-session.command';

type V1CreateSessionCommandHandlerResponse = Session;

@CommandHandler(V1CreateSessionCommand)
export class V1CreateSessionCommandHandler
    implements
        ICommandHandler<
            V1CreateSessionCommand,
            V1CreateSessionCommandHandlerResponse
        >
{
    private readonly logger = new Logger(V1CreateSessionCommandHandler.name);

    constructor(
        @Inject(SESSION_REPOSITORY)
        private readonly sessionRepository: SessionRepositoryPort,
        private readonly queryBus: QueryBus,
        private readonly eventPublisher: EventPublisher,
    ) {}

    static runHandler(
        bus: CommandBus,
        command: V1CreateSessionCommand,
    ): Promise<V1CreateSessionCommandHandlerResponse> {
        return bus.execute<
            V1CreateSessionCommand,
            V1CreateSessionCommandHandlerResponse
        >(new V1CreateSessionCommand(command.user, command.ip));
    }

    async execute(
        command: V1CreateSessionCommand,
    ): Promise<V1CreateSessionCommandHandlerResponse> {
        this.logger.log(`Creating session for user ${command.user.id}`);
        // Check if the user exists
        const user = await V1FindUserByIDQueryHandler.runHandler(
            this.queryBus,
            new V1FindUserByIDQuery(command.user.id),
        );

        if (!user) {
            this.logger.error(
                `User ${command.user.id} failed to create session due to user not existing`,
            );
            throw new GenericNotFoundException("User doesn't exist");
        }

        const newSession = this.eventPublisher.mergeObjectContext(
            Session.create({
                userId: command.user.id,
                ip: command.ip,
            }),
        );

        this.logger.log(
            `User ${command.user.id} has created a session with IP ${command.ip?.toString() ?? 'UNKNOWN'}: ${newSession.token}`,
        );

        await this.sessionRepository.create(newSession);

        newSession.commit();

        return newSession;
    }
}
