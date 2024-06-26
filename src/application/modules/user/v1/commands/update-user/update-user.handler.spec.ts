import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { User } from '@/application/modules/user/entity/user.entity';
import { CreateUserProps } from '@/application/modules/user/entity/user.types';
import { UserRoleEnum } from '@/application/modules/user/entity/user-role.enum';
import { UserRepositoryPort } from '@/application/modules/user/ports/user-repository.port';
import { USER_REPOSITORY } from '@/application/modules/user/user.constants';
import { MockRepositoriesModule } from '@/application/system/repositories/mock-repositories.module';
import { GenericNotFoundException } from '@/core/exceptions/not-found.exception';
import { HashingService } from '@/core/services/hashing/hashing.service';

import { V1UpdateUserCommand } from './update-user.command';
import { V1UpdateUserCommandHandler } from './update-user.handler';

describe('updateUserCommandHandler', () => {
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
            providers: [V1UpdateUserCommandHandler, HashingService],
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

    it('should update user', async () => {
        testUser.email = 'new@email.com';
        testUser.firstName = 'Jane';
        testUser.lastName = 'Smith';
        testUser.password = 'Password123!';
        testUser.role = UserRoleEnum.DEVELOPER;

        const result = await V1UpdateUserCommandHandler.runHandler(
            commandBus,
            new V1UpdateUserCommand(testUser),
        );

        expect(result.email).not.toEqual(testUserProps.email);
        expect(result.firstName).not.toEqual(testUserProps.firstName);
        expect(result.lastName).not.toEqual(testUserProps.lastName);
        expect(result.password).not.toEqual(testUserProps.password);
        expect(result.role).not.toEqual(UserRoleEnum.USER);
    });

    it('should throw error if user not found', async () => {
        await expect(
            V1UpdateUserCommandHandler.runHandler(
                commandBus,
                new V1UpdateUserCommand(User.create(testUserProps)),
            ),
        ).rejects.toThrow(GenericNotFoundException);
    });
});
