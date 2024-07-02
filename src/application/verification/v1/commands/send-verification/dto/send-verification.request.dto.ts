import { IntersectionType } from '@nestjs/swagger';

import { UserEmailDto } from '@/domain/user/user.dto';

export class V1SendVerificationRequestDto extends IntersectionType(
    UserEmailDto,
) {}
