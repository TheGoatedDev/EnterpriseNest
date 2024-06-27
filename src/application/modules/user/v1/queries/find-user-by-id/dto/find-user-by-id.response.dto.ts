import { ApiProperty } from '@nestjs/swagger';

import { User } from '@/domain/user/user.entity';

export class V1FindUserByIDResponseDto {
    @ApiProperty({
        description: 'The User that was found by ID',
        type: User,
    })
    user!: User;
}
