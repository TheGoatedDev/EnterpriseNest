import { ApiProperty, IntersectionType } from '@nestjs/swagger';

import { UserPasswordDto } from '@/application/modules/user/entity/user.dto';
import { User } from '@/application/modules/user/entity/user.entity';

export class V1CreateUserResponseDto extends IntersectionType(UserPasswordDto) {
    @ApiProperty({
        description: 'The User that was created',
        type: User,
    })
    user!: User;
}
