import { Inject, Logger } from '@nestjs/common';
import type { CommandBus, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler, EventPublisher } from '@nestjs/cqrs';

import { Session } from '@/domain/session/session.entity';
import { SESSION_REPOSITORY } from '@/infrastructure/repositories/modules/session/session.repository.constants';
import type { SessionRepositoryPort } from '@/infrastructure/repositories/modules/session/session.repository.port';

import { V1RevokeSessionCommand } from './revoke-session.command';

type V1RevokeSessionCommandHandlerResponse = Session;

@CommandHandler(V1RevokeSessionCommand)
export class V1RevokeSessionCommandHandler
    implements
        ICommandHandler<
            V1RevokeSessionCommand,
            V1RevokeSessionCommandHandlerResponse
        >
{
    private readonly logger = new Logger(V1RevokeSessionCommandHandler.name);

    constructor(
        @Inject(SESSION_REPOSITORY)
        private readonly sessionRepository: SessionRepositoryPort,
        private readonly eventPublisher: EventPublisher,
    ) {}

    static runHandler(
        bus: CommandBus,
        command: V1RevokeSessionCommand,
    ): Promise<V1RevokeSessionCommandHandlerResponse> {
        return bus.execute<
            V1RevokeSessionCommand,
            V1RevokeSessionCommandHandlerResponse
        >(new V1RevokeSessionCommand(command.session));
    }

    async execute(
        command: V1RevokeSessionCommand,
    ): Promise<V1RevokeSessionCommandHandlerResponse> {
        this.logger.log(`Revoking session ${command.session.token}`);

        const session = this.eventPublisher.mergeObjectContext(command.session);

        session.revoke();

        await this.sessionRepository.update(session);

        session.commit();

        this.logger.log(`Revoked Session ${session.token}`);

        return session;
    }
}
