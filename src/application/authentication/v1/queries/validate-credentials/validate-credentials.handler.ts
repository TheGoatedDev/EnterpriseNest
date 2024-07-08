import { Logger } from '@nestjs/common';
import { EventBus, IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';

import { OnValidateCredentialsEvent } from '@/domain/authentication/events/on-validate-credentials.event';
import { AuthenticationNoEmailMatchException } from '@/domain/authentication/exceptions/no-email-match.exception';
import { AuthenticationPasswordIncorrectException } from '@/domain/authentication/exceptions/password-incorrect.exception';
import { User } from '@/domain/user/user.entity';
import { HashingService } from '@/shared/services/hashing/hashing.service';

import { V1FindUserByEmailQueryHandler } from '../../../../user/v1/queries/find-user-by-email/find-user-by-email.handler';
import { V1FindUserByEmailQuery } from '../../../../user/v1/queries/find-user-by-email/find-user-by-email.query';
import { V1ValidateCredentialsQuery } from './validate-credentials.query';

type V1ValidateCredentialsQueryHandlerResponse = User;

@QueryHandler(V1ValidateCredentialsQuery)
export class V1ValidateCredentialsQueryHandler
    implements
        IQueryHandler<
            V1ValidateCredentialsQuery,
            V1ValidateCredentialsQueryHandlerResponse
        >
{
    private readonly logger = new Logger(
        V1ValidateCredentialsQueryHandler.name,
    );

    constructor(
        private readonly queryBus: QueryBus,
        private readonly eventBus: EventBus,
        private readonly hashingService: HashingService,
    ) {}

    static runHandler(
        bus: QueryBus,
        query: V1ValidateCredentialsQuery,
    ): Promise<V1ValidateCredentialsQueryHandlerResponse> {
        return bus.execute<
            V1ValidateCredentialsQuery,
            V1ValidateCredentialsQueryHandlerResponse
        >(new V1ValidateCredentialsQuery(query.email, query.password));
    }

    async execute({
        email,
        password,
    }: V1ValidateCredentialsQuery): Promise<V1ValidateCredentialsQueryHandlerResponse> {
        const user = await V1FindUserByEmailQueryHandler.runHandler(
            this.queryBus,
            new V1FindUserByEmailQuery(email),
        );

        if (!user) {
            this.logger.error(
                `Credentials ${email} failed to validate due to no email match`,
            );

            this.eventBus.publish(
                new OnValidateCredentialsEvent(email, false, false),
            );

            throw new AuthenticationNoEmailMatchException();
        }

        const isPasswordValid = await this.hashingService.compare(
            password,
            user.password,
        );

        if (!isPasswordValid) {
            this.logger.error(
                `Credentials ${email} failed to validate due to password mismatch`,
            );

            this.eventBus.publish(
                new OnValidateCredentialsEvent(email, true, false),
            );

            throw new AuthenticationPasswordIncorrectException();
        }

        this.eventBus.publish(
            new OnValidateCredentialsEvent(email, true, true),
        );

        return user;
    }
}
