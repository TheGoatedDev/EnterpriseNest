import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';

import { IsCuid } from '@/shared/decorator/validation/is-cuid.decorator';

export const ID = (name?: string): PropertyDecorator =>
    applyDecorators(
        ApiProperty({
            description: name ? `${name} ID` : 'Entity ID',
            example: 'x7m4vrctwbuduy18g5jj6lk3',
            type: String,
            required: true,
        }),
        IsCuid(),
    );

export class EntityIDDto {
    @ID()
    id!: string;
}

export const CreatedAt = (): PropertyDecorator =>
    applyDecorators(
        ApiProperty({
            description: 'Entity creation date',
            example: '2021-01-01T00:00:00.000Z',
            type: Date,
            required: true,
        }),
        IsDate(),
    );

export class EntityCreatedAtDto {
    @CreatedAt()
    createdAt!: Date;
}

export const UpdatedAt = (): PropertyDecorator =>
    applyDecorators(
        ApiProperty({
            description: 'Entity update date',
            example: '2021-01-01T00:00:00.000Z',
            type: Date,
            required: true,
        }),
        IsDate(),
    );

export class EntityUpdatedAtDto {
    @UpdatedAt()
    updatedAt!: Date;
}
