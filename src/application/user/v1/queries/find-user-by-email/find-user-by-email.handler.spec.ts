import { CqrsModule, QueryBus } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { CreateMockUser } from '@tests/utils/create-mocks';

import { User } from '@/domain/user/user.entity';
import { USER_REPOSITORY } from '@/infrastructure/repositories/modules/user/user.repository.constants';
import { UserRepositoryPort } from '@/infrastructure/repositories/modules/user/user.repository.port';
import { MockRepositoriesModule } from '@/infrastructure/repositories/presets/mock-repositories.module';

import { V1FindUserByEmailQueryHandler } from './find-user-by-email.handler';
import { V1FindUserByEmailQuery } from './find-user-by-email.query';

describe('findUserByEmailQueryHandler', () => {
    let mockUserRepository: UserRepositoryPort;
    let testUsers: User[];
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
            providers: [V1FindUserByEmailQueryHandler],
        }).compile();

        await module.init();

        mockUserRepository = module.get<UserRepositoryPort>(USER_REPOSITORY);
        queryBus = module.get<QueryBus>(QueryBus);

        testUsers = [...Array.from({ length: 100 }, () => CreateMockUser())];

        await Promise.all(
            testUsers.map((user) => mockUserRepository.create(user)),
        );
    });

    it('should find the user', async () => {
        const user =
            testUsers[Math.floor(Math.random() * testUsers.length)] ??
            CreateMockUser();

        const result = await V1FindUserByEmailQueryHandler.runHandler(
            queryBus,
            new V1FindUserByEmailQuery(user.email),
        );

        expect(result).toEqual(user);
    });
});
