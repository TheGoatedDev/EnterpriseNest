import { CommandBus, CqrsModule } from '@nestjs/cqrs';
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
import { GenericNotFoundException } from '@/shared/exceptions/not-found.exception';

import { V1FindUserByIDQueryHandler } from '../../../../user/v1/queries/find-user-by-id/find-user-by-id.handler';
import { V1RevokeSessionCommand } from './revoke-session.command';
import { V1RevokeSessionCommandHandler } from './revoke-session.handler';

describe('revokeSessionCommandHandler', () => {
    let mockUserRepository: UserRepositoryPort;
    let mockSessionRepository: SessionRepositoryPort;
    let testUser: User;
    let testSession: Session;
    let commandBus: CommandBus;

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
                V1RevokeSessionCommandHandler,
                V1FindUserByIDQueryHandler,
            ],
        }).compile();

        await module.init();

        mockUserRepository = module.get<UserRepositoryPort>(USER_REPOSITORY);
        mockSessionRepository =
            module.get<SessionRepositoryPort>(SESSION_REPOSITORY);
        commandBus = module.get<CommandBus>(CommandBus);

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

        await mockUserRepository.create(testUser);
        await mockSessionRepository.create(testSession);
    });

    it('should revoke session', async () => {
        const result = await V1RevokeSessionCommandHandler.runHandler(
            commandBus,
            new V1RevokeSessionCommand(testSession),
        );

        expect(result.ip).toEqual('1.1.1.1');
        expect(result.userId).toEqual(testUser.id);
        expect(result.isRevoked).toBeTruthy();
    });

    it('should return undefined if user not found', async () => {
        await expect(
            V1RevokeSessionCommandHandler.runHandler(
                commandBus,
                new V1RevokeSessionCommand(
                    Session.create({
                        userId: CreateMockUser().id,
                        ip: '1.1.1.1',
                    }),
                ),
            ),
        ).rejects.toThrow(GenericNotFoundException);
    });
});
