import { ApiProperty } from '@nestjs/swagger';

export class V1GenerateRefreshTokenResponseDto {
    @ApiProperty({
        description: 'The Refresh Token',
        type: String,
    })
    refreshToken!: string;
}
