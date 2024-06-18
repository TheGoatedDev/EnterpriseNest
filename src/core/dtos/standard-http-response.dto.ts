import { ApiProperty } from '@nestjs/swagger';

export class StandardHttpResponseDto<Data = null> {
    @ApiProperty({
        description: 'The status code of the response',
        example: 200,
    })
    statusCode!: number;

    data!: Data;
}
