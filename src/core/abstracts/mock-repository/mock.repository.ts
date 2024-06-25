import { Entity } from '@/core/base/entity/entity.base';
import { GenericAlreadyExistsException } from '@/core/exceptions/already-exists.exception';
import { GenericNotFoundException } from '@/core/exceptions/not-found.exception';
import { RepositoryPort } from '@/core/ports/repository.port';

export abstract class AbstractMockRepository<EntityType extends Entity<unknown>>
    implements RepositoryPort<EntityType>
{
    protected data: EntityType[] = [];

    create: (entity: EntityType) => Promise<EntityType> = async (
        entity: EntityType,
    ) => {
        if (this.data.find((value) => value.id === entity.id)) {
            throw new GenericAlreadyExistsException();
        }

        this.data.push(entity);
        return Promise.resolve(entity);
    };
    update: (entity: EntityType) => Promise<EntityType> = async (
        entity: EntityType,
    ) => {
        const index = this.data.findIndex((order) => order.id === entity.id);

        if (index === -1) {
            throw new GenericNotFoundException();
        }

        this.data[index] = entity;
        return Promise.resolve(entity);
    };
    delete: (entity: EntityType) => Promise<true> = async (
        entity: EntityType,
    ) => {
        if (!this.data.find((value) => value.id === entity.id)) {
            throw new GenericNotFoundException();
        }

        this.data = this.data.filter((value) => value.id !== entity.id);
        return Promise.resolve(true);
    };

    findOneById: (id: string) => Promise<EntityType | undefined> = async (
        id: string,
    ) => {
        return Promise.resolve(this.data.find((order) => order.id === id));
    };
    findAll: () => Promise<EntityType[]> = async () =>
        Promise.resolve(this.data);

    transaction: <T>(handler: () => Promise<T>) => Promise<T> = async <T>(
        handler: () => Promise<T>,
    ) => {
        return Promise.resolve(handler());
    };
}
