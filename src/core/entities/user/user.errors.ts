import {
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common';

export class UserPasswordIncorrectException extends BadRequestException {
    static readonly message = 'Password is incorrect';

    constructor(cause?: Error | string) {
        super(
            cause
                ? `${UserPasswordIncorrectException.message}: ${cause instanceof Error ? cause.message : cause}`
                : UserPasswordIncorrectException.message,
        );
    }
}

export class UserNoEmailMatchException extends BadRequestException {
    static readonly message = "Email doesn't match any user";

    constructor(cause?: Error | string) {
        super(
            cause
                ? `${UserNoEmailMatchException.message}: ${cause instanceof Error ? cause.message : cause}`
                : UserNoEmailMatchException.message,
        );
    }
}

export class UserFailedToCreateException extends InternalServerErrorException {
    static readonly message = 'Failed to create user';

    constructor(cause?: Error | string) {
        super(
            cause
                ? `${UserFailedToCreateException.message}: ${cause instanceof Error ? cause.message : cause}`
                : UserFailedToCreateException.message,
        );
    }
}
