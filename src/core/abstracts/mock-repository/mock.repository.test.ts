import { createId } from '@paralleldrive/cuid2';

import { AbstractMockRepository } from '@/core/abstracts/mock-repository/mock.repository';
import { Entity } from '@/core/base/entity/entity.base';
import { GenericAlreadyExistsException } from '@/core/exceptions/already-exists.exception';
import { GenericNotFoundException } from '@/core/exceptions/not-found.exception';

class MockEntity extends Entity<{
    mockField: string;
}> {
    static createMockEntity(): MockEntity {
        return new MockEntity({
            id: createId(),
            data: {
                mockField: 'mock',
            },
        });
    }

    get mockField(): string {
        return this.data.mockField;
    }

    set mockField(value: string) {
        this.data.mockField = value;
    }

    validate(): boolean {
        return true;
    }
}

class MockEntityRepository extends AbstractMockRepository<MockEntity> {}

describe('abstractMockRepository', () => {
    let repository: MockEntityRepository;

    beforeEach(() => {
        repository = new MockEntityRepository();
    });

    it('should create an instance', () => {
        expect(repository).toBeTruthy();
    });

    it('should create an entity', async () => {
        const entity = MockEntity.createMockEntity();
        const createdEntity = await repository.create(entity);

        expect(createdEntity).toEqual(entity);
    });

    it('should throw when making entities that already exist', async () => {
        const entity = MockEntity.createMockEntity();
        await repository.create(entity);

        await expect(repository.create(entity)).rejects.toThrow(
            GenericAlreadyExistsException,
        );
    });

    it('should find all entities', async () => {
        const entity = MockEntity.createMockEntity();
        await repository.create(entity);

        const entities = await repository.findAll();

        expect(entities).toEqual([entity]);
    });

    it('should update an entity', async () => {
        const entity = MockEntity.createMockEntity();
        const createdEntity = await repository.create(entity);

        createdEntity.mockField = 'updated';

        const updatedEntity = await repository.update(createdEntity);

        expect(updatedEntity.mockField).toBe('updated');
    });

    it('should throw when updating an entity that does not exist', async () => {
        const entity = MockEntity.createMockEntity();

        await expect(repository.update(entity)).rejects.toThrow(
            GenericNotFoundException,
        );
    });

    it('should delete an entity', async () => {
        const entity = MockEntity.createMockEntity();
        const createdEntity = await repository.create(entity);

        await repository.delete(createdEntity);

        const foundEntity = await repository.findOneById(createdEntity.id);

        expect(foundEntity).toBeUndefined();
    });

    it('should throw when deleting an entity that does not exist', async () => {
        const entity = MockEntity.createMockEntity();

        await expect(repository.delete(entity)).rejects.toThrow(
            GenericNotFoundException,
        );
    });

    it('should find an entity by id', async () => {
        const entity = MockEntity.createMockEntity();
        const createdEntity = await repository.create(entity);

        const foundEntity = await repository.findOneById(createdEntity.id);

        expect(foundEntity).toEqual(createdEntity);
    });

    it('should resolve transaction correctly', async () => {
        const handler = jest.fn().mockResolvedValue('Expected Value');
        const result = await repository.transaction(handler);
        expect(handler).toHaveBeenCalledTimes(1);
        expect(result).toBe('Expected Value');
    });
});
