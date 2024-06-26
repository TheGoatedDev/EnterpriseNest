import { ApiProperty } from '@nestjs/swagger';

import { User } from '@/application/modules/user/entity/user.entity';

export class V1UpdateUserResponseDto {
    @ApiProperty({
        description: 'The User that was Updated',
        type: User,
    })
    user!: User;
}
