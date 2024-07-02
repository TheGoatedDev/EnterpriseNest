import { ApiProperty } from '@nestjs/swagger';

import { User } from '@/domain/user/user.entity';

export class V1UpdateUserResponseDto {
    @ApiProperty({
        description: 'The User that was Updated',
        type: User,
    })
    user!: User;
}
