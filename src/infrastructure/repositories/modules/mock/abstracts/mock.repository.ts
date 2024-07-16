import { Entity } from '@/domain/base/entity/entity.base';
import { RepositoryPort } from '@/infrastructure/repositories/repository.port';
import { GenericAlreadyExistsException } from '@/shared/exceptions/already-exists.exception';
import { GenericNotFoundException } from '@/shared/exceptions/not-found.exception';

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

    findAllPaginated: (
        page: number,
        limit: number,
    ) => Promise<{
        entities: EntityType[];
        totalPages: number;
        totalItems: number;
    }> = async (page: number, limit: number) => {
        const start = (page - 1) * limit;
        const end = start + limit;

        return Promise.resolve({
            entities: this.data.slice(start, end),
            totalPages: Math.ceil(this.data.length / limit),
            totalItems: this.data.length,
        });
    };

    transaction: <T>(handler: () => Promise<T>) => Promise<T> = async <T>(
        handler: () => Promise<T>,
    ) => {
        return Promise.resolve(handler());
    };
}
