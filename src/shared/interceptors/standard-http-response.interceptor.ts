// NestJS imports
import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { StandardHttpResponseDto } from '@/shared/dto/standard-http-response.dto';

@Injectable()
export class StandardHttpResponseInterceptor<T> implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<unknown> {
        // Check that the context type is http
        if (context.getType() !== 'http') {
            return next.handle();
        }

        const response = context.switchToHttp().getResponse<Response>();

        const statusCode = response.statusCode;

        return next.handle().pipe(
            map((data: T) => {
                const responseDto = new StandardHttpResponseDto<T>();
                responseDto.statusCode = statusCode;
                responseDto.data = data;
                return responseDto;
            }),
        );
    }
}
