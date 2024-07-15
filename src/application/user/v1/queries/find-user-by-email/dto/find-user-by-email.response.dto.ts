import { ApiProperty } from '@nestjs/swagger';

import { User } from '@/domain/user/user.entity';

export class V1FindUserByEmailResponseDto {
    @ApiProperty({
        description: 'The User that was found by email',
        type: User,
    })
    user!: User;
}
