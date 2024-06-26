import { IntersectionType, PartialType } from '@nestjs/swagger';

import {
    UserEmailDto,
    UserFirstNameDto,
    UserLastNameDto,
    UserPasswordDto,
    UserRoleDto,
} from '@/application/modules/user/entity/user.dto';

export class V1UpdateUserRequestDto extends PartialType(
    IntersectionType(
        UserEmailDto,
        UserPasswordDto,
        UserRoleDto,
        UserFirstNameDto,
        UserLastNameDto,
    ),
) {}
