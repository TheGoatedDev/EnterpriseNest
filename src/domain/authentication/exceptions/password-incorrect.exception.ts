import { BadRequestException } from '@nestjs/common';

export class AuthenticationPasswordIncorrectException extends BadRequestException {
    static readonly message = 'Password is incorrect';

    constructor(cause?: Error | string) {
        super(
            cause
                ? `${AuthenticationPasswordIncorrectException.message}: ${cause instanceof Error ? cause.message : cause}`
                : AuthenticationPasswordIncorrectException.message,
        );
    }
}
