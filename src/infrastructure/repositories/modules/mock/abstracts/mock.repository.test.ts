import { createId } from '@paralleldrive/cuid2';

import { Entity } from '@/domain/base/entity/entity.base';
import { AbstractMockRepository } from '@/infrastructure/repositories/modules/mock/abstracts/mock.repository';
import { GenericAlreadyExistsException } from '@/shared/exceptions/already-exists.exception';
import { GenericNotFoundException } from '@/shared/exceptions/not-found.exception';

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

    it('should find all entities paginated', async () => {
        const entity = MockEntity.createMockEntity();
        await repository.create(MockEntity.createMockEntity());
        await repository.create(entity);

        const getOne = await repository.findAllPaginated(1, 1);
        const getTwo = await repository.findAllPaginated(1, 2);

        const getThree = await repository.findAllPaginated(2, 1);

        expect(getOne.entities.length).toBe(1);
        expect(getOne.totalPages).toBe(2);
        expect(getOne.totalItems).toBe(2);

        expect(getTwo.entities.length).toBe(2);
        expect(getTwo.totalPages).toBe(1);
        expect(getTwo.totalItems).toBe(2);

        expect(getThree.entities.length).toBe(1);
        expect(getThree.totalPages).toBe(2);
        expect(getThree.totalItems).toBe(2);
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
