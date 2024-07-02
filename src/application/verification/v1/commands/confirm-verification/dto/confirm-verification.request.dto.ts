import { ApiProperty } from '@nestjs/swagger';

export class V1ConfirmVerificationRequestDto {
    @ApiProperty({
        description: 'Verification Token',
        type: String,
    })
    verificationToken!: string;
}
