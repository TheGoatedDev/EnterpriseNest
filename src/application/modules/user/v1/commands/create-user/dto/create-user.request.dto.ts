import { IntersectionType } from '@nestjs/swagger';

import { UserEmailDto } from '@/application/modules/user/entity/user.dto';

export class V1CreateUserRequestDto extends IntersectionType(UserEmailDto) {}
