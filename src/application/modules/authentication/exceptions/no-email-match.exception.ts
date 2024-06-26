import { BadRequestException } from '@nestjs/common';

export class AuthenticationNoEmailMatchException extends BadRequestException {
    static readonly message = "Email doesn't match any user";

    constructor(cause?: Error | string) {
        super(
            cause
                ? `${AuthenticationNoEmailMatchException.message}: ${cause instanceof Error ? cause.message : cause}`
                : AuthenticationNoEmailMatchException.message,
        );
    }
}
