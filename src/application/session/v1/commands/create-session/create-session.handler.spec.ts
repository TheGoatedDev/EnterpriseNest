import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { User } from '@/domain/user/user.entity';
import { USER_REPOSITORY } from '@/infrastructure/repositories/modules/user/user.repository.constants';
import { UserRepositoryPort } from '@/infrastructure/repositories/modules/user/user.repository.port';
import { MockRepositoriesModule } from '@/infrastructure/repositories/presets/mock-repositories.module';
import { GenericNotFoundException } from '@/shared/exceptions/not-found.exception';

import { V1FindUserByIDQueryHandler } from '../../../../user/v1/queries/find-user-by-id/find-user-by-id.handler';
import { V1CreateSessionCommand } from './create-session.command';
import { V1CreateSessionCommandHandler } from './create-session.handler';

describe('createSessionCommandHandler', () => {
    let mockUserRepository: UserRepositoryPort;
    let testUser: User;
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
                V1CreateSessionCommandHandler,
                V1FindUserByIDQueryHandler,
            ],
        }).compile();

        await module.init();

        mockUserRepository = module.get<UserRepositoryPort>(USER_REPOSITORY);
        commandBus = module.get<CommandBus>(CommandBus);

        testUser = User.create({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@mail.com',
            password:
                '$argon2id$v=19$m=16,t=2,p=1$b29mYXNkZmFzZGZh$TXcefCmDL26dVuPHuMfCrg',
        });

        await mockUserRepository.create(testUser);
    });

    it('should create session by user', async () => {
        const result = await V1CreateSessionCommandHandler.runHandler(
            commandBus,
            new V1CreateSessionCommand(testUser, '1.1.1.1'),
        );

        expect(result.ip).toEqual('1.1.1.1');
        expect(result.userId).toEqual(testUser.id);
        expect(result.token).toBeDefined();
    });

    it('should return undefined if user not found', async () => {
        await expect(
            V1CreateSessionCommandHandler.runHandler(
                commandBus,
                new V1CreateSessionCommand(
                    User.create({
                        firstName: 'John',
                        lastName: 'Doe',
                        email: 'john.doe@mail.com',
                        password:
                            '$argon2id$v=19$m=16,t=2,p=1$b29mYXNkZmFzZGZh$TXcefCmDL26dVuPHuMfCrg',
                    }),
                    '1.1.1.1',
                ),
            ),
        ).rejects.toThrow(GenericNotFoundException);
    });
});
