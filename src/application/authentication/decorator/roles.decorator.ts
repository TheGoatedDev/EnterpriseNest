import { SetMetadata } from '@nestjs/common';

import { UserRoleEnum } from '@/domain/user/user-role.enum';

export const ROLES_KEY = 'USER_USER_ROLES';
export const Roles = (...roles: UserRoleEnum[]) =>
    SetMetadata(ROLES_KEY, roles);
