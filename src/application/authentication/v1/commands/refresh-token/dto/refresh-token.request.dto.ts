import { IntersectionType } from '@nestjs/swagger';

import { UserEmailDto, UserPasswordDto } from '@/domain/user/user.dto';

export class V1RefreshTokenRequestDto extends IntersectionType(
    UserEmailDto,
    UserPasswordDto,
) {}
