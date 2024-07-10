import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class StandardHttpResponseDto<Data = null> {
    @ApiProperty({
        description: 'The status code of the response',
    })
    @Expose()
    statusCode!: number;

    @Expose()
    data!: Data;
}
