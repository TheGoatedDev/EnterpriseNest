import { IntersectionType } from '@nestjs/swagger';

import {
    UserEmailDto,
    UserFirstNameDto,
    UserLastNameDto,
} from '@/application/modules/user/entity/user.dto';

export class V1CreateUserRequestDto extends IntersectionType(
    UserEmailDto,
    UserFirstNameDto,
    UserLastNameDto,
) {}
