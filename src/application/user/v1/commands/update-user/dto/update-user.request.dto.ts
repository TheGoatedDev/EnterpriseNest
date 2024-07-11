import { IntersectionType, PartialType } from '@nestjs/swagger';

import {
    UserEmailDto,
    UserFirstNameDto,
    UserLastNameDto,
    UserPasswordDto,
    UserRoleDto,
} from '@/domain/user/user.dto';

export class V1UpdateUserRequestDto extends PartialType(
    IntersectionType(
        UserFirstNameDto,
        UserLastNameDto,
        UserEmailDto,
        UserPasswordDto,
        UserRoleDto,
    ),
) {}
