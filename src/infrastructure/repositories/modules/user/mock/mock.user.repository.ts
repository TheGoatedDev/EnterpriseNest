import { type ClassProvider, Injectable } from '@nestjs/common';

import { User } from '@/domain/user/user.entity';
import { AbstractMockRepository } from '@/infrastructure/repositories/modules/mock/abstracts/mock.repository';
import { USER_REPOSITORY } from '@/infrastructure/repositories/modules/user/user.repository.constants';
import { UserRepositoryPort } from '@/infrastructure/repositories/modules/user/user.repository.port';
import { GenericAlreadyExistsException } from '@/shared/exceptions/already-exists.exception';
import { GenericNotFoundException } from '@/shared/exceptions/not-found.exception';
import { HashingService } from '@/shared/services/hashing/hashing.service';

@Injectable()
export class MockUserRepository
    extends AbstractMockRepository<User>
    implements UserRepositoryPort
{
    constructor(private readonly hashingService: HashingService) {
        super();
    }

    findOneByEmail: (email: string) => Promise<User | undefined> = async (
        email: string,
    ) => {
        return Promise.resolve(this.data.find((user) => user.email === email));
    };

    create: (entity: User) => Promise<User> = async (entity: User) => {
        if (await this.findOneById(entity.id)) {
            throw new GenericAlreadyExistsException();
        }

        if (await this.findOneByEmail(entity.email)) {
            throw new GenericAlreadyExistsException();
        }

        if (!entity.isPasswordHashed) {
            entity.password = await this.hashingService.hash(entity.password);
        }

        this.data.push(entity);
        return Promise.resolve(entity);
    };
    update: (entity: User) => Promise<User> = async (entity: User) => {
        const index = this.data.findIndex((user) => user.id === entity.id);

        if (index === -1) {
            throw new GenericNotFoundException();
        }

        if (!entity.isPasswordHashed) {
            entity.password = await this.hashingService.hash(entity.password);
        }

        this.data[index] = entity;
        return Promise.resolve(entity);
    };
}

export const MockUserRepositoryProvider: ClassProvider = {
    provide: USER_REPOSITORY,
    useClass: MockUserRepository,
};
