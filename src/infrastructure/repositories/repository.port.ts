import { Entity } from '@/domain/base/entity/entity.base';

/**
 * RepositoryPort for managing database operations for a particular Entity type.
 */
export interface RepositoryPort<EntityType extends Entity<unknown>> {
    /**
     * Creates an Entity.
     * @param entity - The entity to create.
     * @returns A promise containing the created entity.
     * @throws Error If the creation fails.
     */
    create: (entity: EntityType) => Promise<EntityType>;

    /**
     * Updates an Entity.
     * @param entity - The entity to update.
     * @returns A promise containing the updated entity.
     * @throws Error If the update fails.
     */
    update: (entity: EntityType) => Promise<EntityType>;

    /**
     * Deletes an Entity by id.
     * @param id - The id of the entity to delete.
     * @returns A promise containing a boolean showing the deletion success status.
     * @throws Error If the deletion fails.
     */
    delete: (entity: EntityType) => Promise<true>;

    /**
     * Finds an Entity by id.
     * @param id - The id of the entity to find.
     * @returns A promise containing the entity, or undefined if not found.
     * @throws Error If the search process fails.
     */
    findOneById: (id: string) => Promise<EntityType | undefined>;

    /**
     * Finds all Entities.
     * @returns A promise containing an array of all entities.
     * @throws Error If the search process fails.
     */
    findAll: () => Promise<EntityType[]>;

    /**
     * Finds all Entities paginated.
     * @param page - The page number.
     * @param limit - The number of items per page.
     * @returns A promise containing an array of all entities.
     * @throws Error If the search process fails.
     */
    findAllPaginated: (
        page: number,
        limit: number,
    ) => Promise<{
        entities: EntityType[];
        totalPages: number;
        totalItems: number;
    }>;

    /**
     * Implements a transaction operation.
     * @param handler - The handler for the transaction.
     * @returns A promise containing the transaction result.
     * @throws Error If the transaction fails.
     */
    transaction: <T>(handler: () => Promise<T>) => Promise<T>;
}
