// NestJS imports
import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { NonStandardResponseKey } from '@/shared/decorator/non-standard-response.decorator';
import { StandardHttpResponseDto } from '@/shared/dto/standard-http-response.dto';

@Injectable()
export class StandardHttpResponseInterceptor<T> implements NestInterceptor {
    constructor(private readonly reflector: Reflector) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<unknown> {
        // Check that the context type is http
        if (context.getType() !== 'http') {
            return next.handle();
        }

        const shouldSkip = this.reflector.getAllAndOverride<boolean>(
            NonStandardResponseKey,
            [context.getHandler(), context.getClass()],
        );

        // Check if the response should be skipped
        if (shouldSkip) {
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
