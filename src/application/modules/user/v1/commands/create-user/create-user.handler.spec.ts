import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { MockRepositoriesModule } from '@/application/system/repositories/mock-repositories.module';
import { User } from '@/domain/user/user.entity';
import { GenericAlreadyExistsException } from '@/shared/exceptions/already-exists.exception';

import { V1CreateUserCommand } from './create-user.command';
import { V1CreateUserCommandHandler } from './create-user.handler';

describe('createUserCommandHandler', () => {
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
            providers: [V1CreateUserCommandHandler],
        }).compile();

        await module.init();

        commandBus = module.get<CommandBus>(CommandBus);

        testUser = User.create({
            email: 'john.doe@mail.com',
            password:
                '$argon2id$v=19$m=16,t=2,p=1$b29mYXNkZmFzZGZh$TXcefCmDL26dVuPHuMfCrg',
        });
    });

    it('should create user', async () => {
        const result = await V1CreateUserCommandHandler.runHandler(
            commandBus,
            new V1CreateUserCommand(testUser),
        );

        expect(result).toEqual(testUser);
    });

    it('should return undefined if user not found', async () => {
        await V1CreateUserCommandHandler.runHandler(
            commandBus,
            new V1CreateUserCommand(testUser),
        );

        await expect(
            V1CreateUserCommandHandler.runHandler(
                commandBus,
                new V1CreateUserCommand(testUser),
            ),
        ).rejects.toThrow(GenericAlreadyExistsException);
    });
});
