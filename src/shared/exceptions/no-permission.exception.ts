import { ForbiddenException } from '@nestjs/common';

export class GenericNoPermissionException extends ForbiddenException {
    static readonly message =
        'You are not authorized to perform this action or access this resource. Please make sure you have the necessary permissions.';

    constructor(cause?: Error | string) {
        super(
            cause
                ? `${GenericNoPermissionException.message}: ${cause instanceof Error ? cause.message : cause}`
                : GenericNoPermissionException.message,
        );
    }
}
