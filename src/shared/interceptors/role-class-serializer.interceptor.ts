import type {
    CallHandler,
    ExecutionContext,
    PlainLiteralObject,
} from '@nestjs/common';
import { ClassSerializerInterceptor, Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { UserRoleEnum } from '@/domain/user/user-role.enum';
import { RequestWithUser } from '@/types/express/request-with-user';

@Injectable()
export class RolesClassSerializerInterceptor extends ClassSerializerInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<unknown> {
        const user = context.switchToHttp().getRequest<RequestWithUser>()
            .user as RequestWithUser['user'] | undefined;

        const userRole = user?.role ?? UserRoleEnum.USER;

        const contextOptions = this.getContextOptions(context);
        const options = {
            ...this.defaultOptions,
            ...contextOptions,
            groups: [userRole],
        };

        return next
            .handle()
            .pipe(
                map((res: PlainLiteralObject | PlainLiteralObject[]) =>
                    this.serialize(res, options),
                ),
            );
    }
}
