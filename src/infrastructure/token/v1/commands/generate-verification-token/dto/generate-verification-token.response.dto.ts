import { ApiProperty } from '@nestjs/swagger';

export class V1GenerateVerificationTokenResponseDto {
    @ApiProperty({
        description: 'The Verification Token',
        type: String,
    })
    verificationToken!: string;
}
