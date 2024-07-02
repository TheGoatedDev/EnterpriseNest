import { ApiProperty } from '@nestjs/swagger';

import { User } from '@/domain/user/user.entity';

export class V1FindCurrentUserResponseDto {
    @ApiProperty({
        description: 'The User that was found',
        type: User,
    })
    user!: User;
}
