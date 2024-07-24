import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiOperationOptions } from '@nestjs/swagger';

import { Roles } from '@/application/authentication/decorator/roles.decorator';
import { UserRoleEnum } from '@/domain/user/user-role.enum';

export const ApiOperationWithRoles = (
    options: ApiOperationOptions,
    roles: UserRoleEnum[] = [...Object.values(UserRoleEnum)],
) =>
    applyDecorators(
        ApiOperation({
            ...options,
            summary: `${options.summary ?? 'Unknown'} - Roles: ${roles.join(', ')}`,
        }),
        Roles(...roles),
    );
