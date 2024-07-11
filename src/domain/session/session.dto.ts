import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { IsCuid } from '@/shared/decorator/validation/is-cuid.decorator';

export class EntityIDDto {
    @ApiProperty({
        description: 'Entity ID',
        example: 'b0c4e5f2-3d2d-4f9f-8b4b-6d3b3d2d4f9f',
        type: String,
        required: true,
    })
    @Expose()
    @IsCuid()
    id!: string;
}
