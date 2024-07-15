import { IntersectionType } from '@nestjs/swagger';

import { UserEmailDto } from '@/domain/user/user.dto';

export class V1FindUserByEmailParamDto extends IntersectionType(UserEmailDto) {}
