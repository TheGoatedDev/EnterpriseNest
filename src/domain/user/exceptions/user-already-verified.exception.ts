import { ForbiddenException } from '@nestjs/common';

export class UserAlreadyVerifiedException extends ForbiddenException {
    static readonly message = 'User is already verified';

    constructor(cause?: Error | string) {
        super(
            cause
                ? `${UserAlreadyVerifiedException.message}: ${cause instanceof Error ? cause.message : cause}`
                : UserAlreadyVerifiedException.message,
        );
    }
}
