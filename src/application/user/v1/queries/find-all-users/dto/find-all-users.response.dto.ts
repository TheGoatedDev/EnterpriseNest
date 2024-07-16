import { ApiProperty } from '@nestjs/swagger';

import { User } from '@/domain/user/user.entity';

export class V1FindAllUsersResponseDto {
    @ApiProperty({
        description: 'All Users found.',
        type: User,
        isArray: true,
    })
    users!: User[];
}
