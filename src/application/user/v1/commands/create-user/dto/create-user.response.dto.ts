import { ApiProperty, IntersectionType } from '@nestjs/swagger';

import { UserPasswordDto } from '@/domain/user/user.dto';
import { User } from '@/domain/user/user.entity';

export class V1CreateUserResponseDto extends IntersectionType(UserPasswordDto) {
    @ApiProperty({
        description: 'The User that was created',
        type: User,
    })
    user!: User;
}
