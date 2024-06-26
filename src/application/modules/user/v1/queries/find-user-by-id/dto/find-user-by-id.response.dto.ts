import { ApiProperty } from '@nestjs/swagger';

import { User } from '@/application/modules/user/entity/user.entity';

export class V1FindUserByIDResponseDto {
    @ApiProperty({
        description: 'The User that was found by ID',
        type: User,
    })
    user!: User;
}
