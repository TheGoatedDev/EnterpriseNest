import { ApiProperty } from '@nestjs/swagger';

export class V1RefreshTokenResponseDto {
    @ApiProperty({
        description: 'Access token',
        type: String,
    })
    accessToken!: string;
}
