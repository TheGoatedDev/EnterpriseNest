import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { IS_PUBLIC_KEY } from '@/application/authentication/decorator/public.decorator';
import { ROLES_KEY } from '@/application/authentication/decorator/roles.decorator';
import { UserRoleEnum } from '@/domain/user/user-role.enum';
import { GenericNoPermissionException } from '@/shared/exceptions/no-permission.exception';
import { GenericUnauthenticatedException } from '@/shared/exceptions/unauthenticated.exception';
import { RequestWithUser } from '@/types/express/request-with-user';

@Injectable()
export class AccessTokenGuard extends AuthGuard('accessToken') {
    private readonly logger = new Logger(AccessTokenGuard.name);

    constructor(private reflector: Reflector) {
        super();
    }

    async canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (isPublic) {
            return true;
        }

        const baseCanActivate = await super.canActivate(context);

        if (!baseCanActivate) {
            this.logger.error('Access Token is invalid');
            return baseCanActivate;
        }

        const requiredRoles =
            this.reflector.getAllAndOverride<UserRoleEnum[] | undefined>(
                ROLES_KEY,
                [context.getHandler(), context.getClass()],
            ) ?? [];

        if (requiredRoles.length === 0) {
            return true;
        }

        const user = context.switchToHttp().getRequest<RequestWithUser>()
            .user as RequestWithUser['user'] | undefined;

        if (!user) {
            throw new GenericUnauthenticatedException('Not authenticated');
        }

        const hasRole = requiredRoles.some((role) => user.role.includes(role));

        if (!hasRole) {
            this.logger.error(
                `User does not have the required role: ${requiredRoles.join(', ')}`,
            );
            throw new GenericNoPermissionException(
                `User does not have the required role: ${requiredRoles.join(', ')}`,
            );
        }

        return true;
    }
}
