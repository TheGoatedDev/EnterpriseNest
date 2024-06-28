import { IntersectionType } from '@nestjs/swagger';

import {
    UserEmailDto,
    UserFirstNameDto,
    UserLastNameDto,
    UserPasswordDto,
} from '@/domain/user/user.dto';

export class V1RegisterRequestDto extends IntersectionType(
    UserFirstNameDto,
    UserLastNameDto,
    UserEmailDto,
    UserPasswordDto,
) {}
