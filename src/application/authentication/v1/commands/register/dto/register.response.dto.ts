import { ApiProperty } from '@nestjs/swagger';

import { User } from '@/domain/user/user.entity';

export class V1RegisterResponseDto {
    @ApiProperty({
        description: 'User that was registered',
        example: '',
        type: User,
    })
    user!: User;

    @ApiProperty({
        description: 'If Verification is required',
        example: '',
        type: Boolean,
    })
    verificationRequired!: boolean;
}
