import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { TraceService } from 'nestjs-otel';
import { Observable } from 'rxjs';

import { User } from '@/domain/user/user.entity';
import { RequestWithUser } from '@/types/express/request-with-user';

@Injectable()
export class TraceUserInterceptor implements NestInterceptor {
    constructor(private readonly traceService: TraceService) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<unknown> {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest<RequestWithUser>();
        const user = request.user as User | undefined;

        if (user) {
            const span = this.traceService.getSpan();

            span?.setAttribute('userId', user.id);
            span?.setAttribute('userEmail', user.email);
        }

        return next.handle();
    }
}
