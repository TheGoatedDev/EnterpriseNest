import { AggregateRoot } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

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

    @ApiProperty({
        description: 'Entity ID',
        example: 'b0c4e5f2-3d2d-4f9f-8b4b-6d3b3d2d4f9f',
        type: String,
        required: true,
    })
    @Expose()
    get id(): EntityID {
        return this._id;
    }

    @ApiProperty({
        description: 'Entity creation date',
        example: '2021-01-01T00:00:00.000Z',
        type: Date,
        required: true,
    })
    @Expose()
    get createdAt(): Date {
        return this._createdAt;
    }

    @ApiProperty({
        description: 'Entity update date',
        example: '2021-01-01T00:00:00.000Z',
        type: Date,
        required: true,
    })
    @Expose()
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
    public abstract validate(): void;
}
