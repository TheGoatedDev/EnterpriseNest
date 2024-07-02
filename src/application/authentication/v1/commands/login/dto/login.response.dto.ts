import { ApiProperty } from '@nestjs/swagger';

export class V1LoginResponseDto {
    @ApiProperty({
        description: 'Access token',
        type: String,
    })
    accessToken!: string;

    @ApiProperty({
        description: 'Refresh token',
        type: String,
    })
    refreshToken!: string;
}
