import { IntersectionType } from '@nestjs/swagger';

import {
    UserEmailDto,
    UserPasswordDto,
} from '@/application/modules/user/entity/user.dto';

export class V1LoginRequestDto extends IntersectionType(
    UserEmailDto,
    UserPasswordDto,
) {}
