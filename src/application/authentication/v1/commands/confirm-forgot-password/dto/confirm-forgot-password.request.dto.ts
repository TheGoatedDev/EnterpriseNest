import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty } from 'class-validator';

import { UserPasswordDto } from '@/domain/user/user.dto';
import { IsEqualToProperty } from '@/shared/decorator/validation/is-equal-to-property.decorator';

export class V1ConfirmForgotPasswordRequestDto extends IntersectionType(
    UserPasswordDto,
) {
    @ApiProperty({
        example: 'Password123!',
        description:
            'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character and be at least 8 characters long.',
    })
    @IsEqualToProperty('password', {
        message: 'Password confirmation does not match password',
    })
    passwordConfirmation!: string;

    @ApiProperty({
        description: 'Reset Password Token',
        example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoicmVzZXQtcGFzc3dvcmQifQ.1lJ4FzQ2Z6VY7B6r1Y1J9zL4b9i0f5ZGzI4t5J8z0zg',
    })
    @IsJWT()
    @IsNotEmpty()
    resetPasswordToken!: string;
}
