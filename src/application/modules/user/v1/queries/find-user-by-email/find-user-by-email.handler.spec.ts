import { CqrsModule, QueryBus } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import {
    CreateUserMock,
    User,
} from '@/application/modules/user/entity/user.entity';
import { UserRepositoryPort } from '@/application/modules/user/ports/user-repository.port';
import { USER_REPOSITORY } from '@/application/modules/user/user.constants';
import { MockRepositoriesModule } from '@/application/system/repositories/mock-repositories.module';

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

        testUsers = [...Array.from({ length: 100 }, () => CreateUserMock())];

        await Promise.all(
            testUsers.map((user) => mockUserRepository.create(user)),
        );
    });

    it('should find the user', async () => {
        const user =
            testUsers[Math.floor(Math.random() * testUsers.length)] ??
            CreateUserMock();

        const result = await V1FindUserByEmailQueryHandler.runHandler(
            queryBus,
            new V1FindUserByEmailQuery(user.email),
        );

        expect(result).toEqual(user);
    });
});
