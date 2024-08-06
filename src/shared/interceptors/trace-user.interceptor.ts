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
        let user: User | undefined = undefined;

        if (context.getType() === 'http') {
            const httpContext = context.switchToHttp();
            const request = httpContext.getRequest<RequestWithUser>();
            user = request.user;
        }

        if (user) {
            const span = this.traceService.getSpan();

            span?.setAttribute('userId', user.id);
            span?.setAttribute('userEmail', user.email);
        }

        return next.handle();
    }
}
