import { ApiProperty } from '@nestjs/swagger';

export class V1GenerateResetPasswordTokenResponseDto {
    @ApiProperty({
        description: 'The Reset Password Token',
        type: String,
    })
    resetPasswordToken!: string;
}
