import { IntersectionType } from '@nestjs/swagger';

import { UserEmailDto, UserPasswordDto } from '@/core/entities/user/user.dto';

export class V1LoginRequestDto extends IntersectionType(
    UserEmailDto,
    UserPasswordDto,
) {}
