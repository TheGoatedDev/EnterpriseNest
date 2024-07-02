import { UnauthorizedException } from '@nestjs/common';

export class GenericUnauthenticatedException extends UnauthorizedException {
    static readonly message = "You're not authenticated to perform this action";

    constructor(cause?: Error | string) {
        super(
            cause
                ? `${GenericUnauthenticatedException.message}: ${cause instanceof Error ? cause.message : cause}`
                : GenericUnauthenticatedException.message,
        );
    }
}
