import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { CreateUserProps, User } from '@/domain/user/user.entity';
import { UserRoleEnum } from '@/domain/user/user-role.enum';
import { USER_REPOSITORY } from '@/infrastructure/repositories/modules/user/user.repository.constants';
import { UserRepositoryPort } from '@/infrastructure/repositories/modules/user/user.repository.port';
import { MockRepositoriesModule } from '@/infrastructure/repositories/presets/mock-repositories.module';
import { GenericNotFoundException } from '@/shared/exceptions/not-found.exception';
import { HashingService } from '@/shared/services/hashing/hashing.service';

import { V1DeleteUserCommand } from './delete-user.command';
import { V1DeleteUserCommandHandler } from './delete-user.handler';

describe('deleteUserCommandHandler', () => {
    let testUserProps: CreateUserProps;
    let testUser: User;
    let commandBus: CommandBus;
    let userRepository: UserRepositoryPort;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                CqrsModule,
                JwtModule.register({
                    secret: 'test',
                }),
                MockRepositoriesModule,
            ],
            providers: [V1DeleteUserCommandHandler, HashingService],
        }).compile();

        await module.init();

        commandBus = module.get<CommandBus>(CommandBus);
        userRepository = module.get<UserRepositoryPort>(USER_REPOSITORY);

        testUserProps = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@mail.com',
            password:
                '$argon2id$v=19$m=16,t=2,p=1$b29mYXNkZmFzZGZh$TXcefCmDL26dVuPHuMfCrg',
        };

        testUser = User.create(testUserProps);

        await userRepository.create(testUser);
    });

    it('should delete user', async () => {
        testUser.email = 'new@email.com';
        testUser.firstName = 'Jane';
        testUser.lastName = 'Smith';
        testUser.password = 'Password123!';
        testUser.role = UserRoleEnum.DEVELOPER;

        const result = await V1DeleteUserCommandHandler.runHandler(
            commandBus,
            new V1DeleteUserCommand(testUser),
        );

        expect(result).toBeInstanceOf(User);
        expect(result).toBe(testUser);
    });

    it('should throw error if user not found', async () => {
        await expect(
            V1DeleteUserCommandHandler.runHandler(
                commandBus,
                new V1DeleteUserCommand(User.create(testUserProps)),
            ),
        ).rejects.toThrow(GenericNotFoundException);
    });
});
