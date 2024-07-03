import { ApiProperty } from '@nestjs/swagger';

export class V1GenerateAccessTokenResponseDto {
    @ApiProperty({
        description: 'The Access Token',
        type: String,
    })
    accessToken!: string;
}
