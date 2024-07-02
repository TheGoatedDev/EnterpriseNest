import { IntersectionType } from '@nestjs/swagger';

import {
    UserEmailDto,
    UserFirstNameDto,
    UserLastNameDto,
} from '@/domain/user/user.dto';

export class V1CreateUserRequestDto extends IntersectionType(
    UserEmailDto,
    UserFirstNameDto,
    UserLastNameDto,
) {}
