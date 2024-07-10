import { CqrsModule, QueryBus } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { CreateMockUser } from '@tests/utils/create-mocks';

import { Session } from '@/domain/session/session.entity';
import { User } from '@/domain/user/user.entity';
import { SESSION_REPOSITORY } from '@/infrastructure/repositories/modules/session/session.repository.constants';
import { SessionRepositoryPort } from '@/infrastructure/repositories/modules/session/session.repository.port';
import { USER_REPOSITORY } from '@/infrastructure/repositories/modules/user/user.repository.constants';
import { UserRepositoryPort } from '@/infrastructure/repositories/modules/user/user.repository.port';
import { MockRepositoriesModule } from '@/infrastructure/repositories/presets/mock-repositories.module';

import { V1FindAllSessionsByUserQueryHandler } from './find-all-sessions-by-user.handler';
import { V1FindAllSessionsByUserQuery } from './find-all-sessions-by-user.query';

describe('findSessionByUserQueryHandler', () => {
    let mockUserRepository: UserRepositoryPort;
    let mockSessionRepository: SessionRepositoryPort;
    let testUser: User;
    let testSession: Session;
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
            providers: [V1FindAllSessionsByUserQueryHandler],
        }).compile();

        await module.init();

        mockUserRepository = module.get<UserRepositoryPort>(USER_REPOSITORY);
        mockSessionRepository =
            module.get<SessionRepositoryPort>(SESSION_REPOSITORY);

        queryBus = module.get<QueryBus>(QueryBus);

        testUser = User.create({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@mail.com',
            password:
                '$argon2id$v=19$m=16,t=2,p=1$b29mYXNkZmFzZGZh$TXcefCmDL26dVuPHuMfCrg',
        });

        testSession = Session.create({
            userId: testUser.id,
            ip: '1.1.1.1',
        });

        await mockSessionRepository.create(testSession);
        await mockUserRepository.create(testUser);
    });

    it('should find session by token', async () => {
        const result = await V1FindAllSessionsByUserQueryHandler.runHandler(
            queryBus,
            new V1FindAllSessionsByUserQuery(testUser),
        );

        expect(result).toContain(testSession);
    });

    it('should return undefined if user not found', async () => {
        const result = await V1FindAllSessionsByUserQueryHandler.runHandler(
            queryBus,
            new V1FindAllSessionsByUserQuery(CreateMockUser()),
        );

        expect(result).toHaveLength(0);
    });
});
