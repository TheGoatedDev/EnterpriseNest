import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { RequestWithUser } from '@/types/express/request-with-user';

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<RequestWithUser>();
        return request.user;
    },
);
