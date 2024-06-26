import { ApiProperty } from '@nestjs/swagger';

export class V1LoginResponseDto {
    @ApiProperty({
        description: 'The Token that was created',
        type: String,
    })
    token!: string;
}
