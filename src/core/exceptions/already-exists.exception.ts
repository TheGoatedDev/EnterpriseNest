import { ConflictException } from '@nestjs/common';

export class GenericAlreadyExistsException extends ConflictException {
    static readonly message = 'Entity already exists';

    constructor(cause?: Error | string) {
        super(
            cause
                ? `${GenericAlreadyExistsException.message}: ${cause instanceof Error ? cause.message : cause}`
                : GenericAlreadyExistsException.message,
        );
    }
}
