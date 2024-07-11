import { AggregateRoot } from '@nestjs/cqrs';
import { Expose } from 'class-transformer';
import { validateSync } from 'class-validator';

import { CreatedAt, ID, UpdatedAt } from '@/domain/base/entity/entity.base.dto';
import { GenericInternalValidationException } from '@/shared/exceptions/internal-validation.exception';

export type EntityID = string;

export interface BaseEntityProps {
    id: EntityID;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateEntityProps<EntityData> {
    id: EntityID;
    data: EntityData;
    createdAt?: Date;
    updatedAt?: Date;
}

export abstract class Entity<EntityData> extends AggregateRoot {
    constructor(props: CreateEntityProps<EntityData>) {
        super();

        this._id = props.id;

        const now = new Date();
        this._createdAt = props.createdAt ?? now;
        this._updatedAt = props.updatedAt ?? now;

        this.data = props.data;
        this.validate();
    }

    protected readonly _id: EntityID;

    protected readonly data: EntityData;

    private readonly _createdAt: Date;
    private _updatedAt: Date;

    @Expose()
    @ID()
    get id(): EntityID {
        return this._id;
    }

    @CreatedAt()
    @Expose()
    get createdAt(): Date {
        return this._createdAt;
    }

    @Expose()
    @UpdatedAt()
    get updatedAt(): Date {
        return this._updatedAt;
    }

    updated(): void {
        this._updatedAt = new Date();
        this.validate();
    }

    public getData(): EntityData & BaseEntityProps {
        return Object.freeze({
            ...this.data,
            id: this.id,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        });
    }

    // Throws an error if the entity is invalid
    public validate(): void {
        const errors = validateSync(this.data as object);
        errors.push(...validateSync(this));

        if (errors.length > 0) {
            throw new GenericInternalValidationException(
                errors
                    .map((error) =>
                        Object.values(
                            error.constraints as Record<string, string>,
                        ).join(', '),
                    )
                    .join('\n'),
            );
        }
    }
}
