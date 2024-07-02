import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class StandardHttpResponseDto<Data = null> {
    @Expose()
    @ApiProperty({
        description: 'The status code of the response',
    })
    statusCode!: number;

    @Expose()
    data!: Data;
}
