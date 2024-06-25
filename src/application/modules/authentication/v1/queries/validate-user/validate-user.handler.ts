import { Logger } from '@nestjs/common';
import type { IQueryHandler } from '@nestjs/cqrs';
import { QueryBus, QueryHandler } from '@nestjs/cqrs';

import { User } from '@/core/entities/user/user.entity';
import {
    UserNoEmailMatchException,
    UserPasswordIncorrectException,
} from '@/core/entities/user/user.errors';
import { HashingService } from '@/core/services/hashing/hashing.service';

import { V1FindUserByEmailQueryHandler } from '../../../../user/v1/queries/find-user-by-email/find-user-by-email.handler';
import { V1FindUserByEmailQuery } from '../../../../user/v1/queries/find-user-by-email/find-user-by-email.query';
import { V1ValidateUserQuery } from './validate-user.query';

@QueryHandler(V1ValidateUserQuery)
export class V1ValidateUserQueryHandler
    implements IQueryHandler<V1ValidateUserQuery, User>
{
    private readonly logger = new Logger(V1ValidateUserQueryHandler.name);

    constructor(
        private readonly queryBus: QueryBus,
        private readonly hashingService: HashingService,
    ) {}

    static runHandler(
        bus: QueryBus,
        query: V1ValidateUserQuery,
    ): Promise<User> {
        return bus.execute<V1ValidateUserQuery, User>(
            new V1ValidateUserQuery(query.email, query.password),
        );
    }

    async execute({ email, password }: V1ValidateUserQuery): Promise<User> {
        const user = await V1FindUserByEmailQueryHandler.runHandler(
            this.queryBus,
            new V1FindUserByEmailQuery(email),
        );

        if (!user) {
            this.logger.error(
                `User ${email} failed to validate due to no email match`,
            );
            throw new UserNoEmailMatchException();
        }

        const isPasswordValid = await this.hashingService.compare(
            password,
            user.getData().password,
        );

        if (!isPasswordValid) {
            this.logger.error(
                `User ${email} failed to validate due to password mismatch`,
            );
            throw new UserPasswordIncorrectException();
        }

        return user;
    }
}
