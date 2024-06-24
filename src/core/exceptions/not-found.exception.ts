import { NotFoundException } from '@nestjs/common';

export class GenericNotFoundException extends NotFoundException {
    static readonly message = 'Entity not found';

    constructor(cause?: Error | string) {
        super(
            cause
                ? `${GenericNotFoundException.message}: ${cause instanceof Error ? cause.message : cause}`
                : GenericNotFoundException.message,
        );
    }
}
