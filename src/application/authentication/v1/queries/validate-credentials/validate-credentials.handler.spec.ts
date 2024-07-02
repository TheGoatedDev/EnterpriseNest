import { CqrsModule, QueryBus } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { AuthenticationNoEmailMatchException } from '@/domain/authentication/exceptions/no-email-match.exception';
import { AuthenticationPasswordIncorrectException } from '@/domain/authentication/exceptions/password-incorrect.exception';
import { User } from '@/domain/user/user.entity';
import { USER_REPOSITORY } from '@/infrastructure/repositories/modules/user/user.repository.constants';
import { UserRepositoryPort } from '@/infrastructure/repositories/modules/user/user.repository.port';
import { MockRepositoriesModule } from '@/infrastructure/repositories/presets/mock-repositories.module';
import { HashingService } from '@/shared/services/hashing/hashing.service';

import { V1FindUserByEmailQueryHandler } from '../../../../user/v1/queries/find-user-by-email/find-user-by-email.handler';
import { V1ValidateCredentialsQueryHandler } from './validate-credentials.handler';
import { V1ValidateCredentialsQuery } from './validate-credentials.query';

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
                V1ValidateCredentialsQueryHandler,
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
        const result = await V1ValidateCredentialsQueryHandler.runHandler(
            queryBus,
            new V1ValidateCredentialsQuery(testUser.email, 'password'),
        );

        expect(result).toEqual(testUser);
    });

    it('should throw error if the email dont match', async () => {
        await expect(
            V1ValidateCredentialsQueryHandler.runHandler(
                queryBus,
                new V1ValidateCredentialsQuery('non-found', 'password'),
            ),
        ).rejects.toThrow(AuthenticationNoEmailMatchException);
    });

    it('should throw error if the password dont match', async () => {
        await expect(
            V1ValidateCredentialsQueryHandler.runHandler(
                queryBus,
                new V1ValidateCredentialsQuery(testUser.email, 'incorrect'),
            ),
        ).rejects.toThrow(AuthenticationPasswordIncorrectException);
    });
});
