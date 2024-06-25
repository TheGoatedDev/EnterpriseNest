import { CqrsModule, QueryBus } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { MockRepositoriesModule } from '@/application/system/repositories/mock-repositories.module';
import { UserRepositoryPort } from '@/core/entities/user/ports/user-repository.port';
import { USER_REPOSITORY } from '@/core/entities/user/user.constants';
import { User } from '@/core/entities/user/user.entity';
import {
    UserNoEmailMatchException,
    UserPasswordIncorrectException,
} from '@/core/entities/user/user.errors';
import { HashingService } from '@/core/services/hashing/hashing.service';

import { V1FindUserByEmailQueryHandler } from '../../../../user/v1/queries/find-user-by-email/find-user-by-email.handler';
import { V1ValidateUserQueryHandler } from './validate-user.handler';
import { V1ValidateUserQuery } from './validate-user.query';

describe('validateUserQueryHandler', () => {
    let mockUserRepository: UserRepositoryPort;
    let testUser: User;
    let queryBus: QueryBus;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                CqrsModule,
                JwtModule.register({
                    secret: 'test',
                }),
                MockRepositoriesModule,
            ],
            providers: [
                V1ValidateUserQueryHandler,
                HashingService,
                V1FindUserByEmailQueryHandler,
            ],
        }).compile();

        await module.init();

        mockUserRepository = module.get<UserRepositoryPort>(USER_REPOSITORY);

        queryBus = module.get<QueryBus>(QueryBus);

        testUser = User.create({
            email: 'john.doe@mail.com',
            password:
                '$argon2id$v=19$m=16,t=2,p=1$b29mYXNkZmFzZGZh$TXcefCmDL26dVuPHuMfCrg',
        });

        await mockUserRepository.create(testUser);
    });

    it('should find user by authenticating', async () => {
        const result = await V1ValidateUserQueryHandler.runHandler(
            queryBus,
            new V1ValidateUserQuery(testUser.email, 'password'),
        );

        expect(result).toEqual(testUser);
    });

    it('should throw error if the email dont match', async () => {
        await expect(
            V1ValidateUserQueryHandler.runHandler(
                queryBus,
                new V1ValidateUserQuery('non-found', 'password'),
            ),
        ).rejects.toThrow(UserNoEmailMatchException);
    });

    it('should throw error if the password dont match', async () => {
        await expect(
            V1ValidateUserQueryHandler.runHandler(
                queryBus,
                new V1ValidateUserQuery(testUser.email, 'incorrect'),
            ),
        ).rejects.toThrow(UserPasswordIncorrectException);
    });
});
