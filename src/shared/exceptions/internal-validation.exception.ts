import { InternalServerErrorException } from '@nestjs/common';

export class GenericInternalValidationException extends InternalServerErrorException {
    static readonly message = 'Entity not valid';

    constructor(cause?: Error | string) {
        super(
            cause
                ? `${GenericInternalValidationException.message}: ${cause instanceof Error ? cause.message : cause}`
                : GenericInternalValidationException.message,
        );
    }
}
