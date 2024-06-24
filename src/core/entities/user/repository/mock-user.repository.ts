import { Injectable } from '@nestjs/common';

import { AbstractMockRepository } from '@/core/abstracts/mock-repository/mock.repository';
import { UserRepositoryPort } from '@/core/entities/user/ports/user-repository.port';
import { User } from '@/core/entities/user/user.entity';
import { GenericAlreadyExistsException } from '@/core/exceptions/already-exists.exception';
import { GenericNotFoundException } from '@/core/exceptions/not-found.exception';
import { HashingService } from '@/core/services/hashing/hashing.service';

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
