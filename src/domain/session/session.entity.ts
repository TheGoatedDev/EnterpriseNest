import { ApiProperty } from '@nestjs/swagger';
import { createId } from '@paralleldrive/cuid2';
import { Expose } from 'class-transformer';
import { ZodError } from 'zod';

import { Entity } from '@/domain/base/entity/entity.base';
import { OnSessionRevokedEvent } from '@/domain/session/events/on-session-revoked.event';
import { AllStaffRoles } from '@/domain/user/user-role.enum';
import { GenericInternalValidationException } from '@/shared/exceptions/internal-validation.exception';

import type { CreateSessionProps, SessionProps } from './session.types';
import { SessionSchema } from './session.types';

export class Session extends Entity<SessionProps> {
    static create(props: CreateSessionProps): Session {
        const id = createId();

        const data: SessionProps = {
            ...props,
            isRevoked: false,
            token: createId(),
        };

        return new Session({ id, data });
    }

    @Expose()
    @ApiProperty({
        description: 'The user ID of the session',
        example: 'b0c4e5f2-3d2d-4f9f-8b4b-6d3b3d2d4f9f',
        type: String,
        required: true,
    })
    get userId(): string {
        return this.data.userId;
    }

    @Expose()
    @ApiProperty({
        description: 'The token of the session',
        example: 'b0c4e5f2-3d2d-4f9f-8b4b-6d3b3d2d4f9f',
        type: String,
        required: true,
    })
    get token(): string {
        return this.data.token;
    }

    @Expose()
    @ApiProperty({
        description: 'If the session is revoked',
        type: Boolean,
        required: true,
        example: false,
    })
    get isRevoked(): boolean {
        return this.data.isRevoked;
    }

    @Expose({
        groups: [...AllStaffRoles],
    })
    @ApiProperty({
        description: 'The IP of the session (if available)',
        type: String,
        example: '1.1.1.1',
    })
    get ip(): string | undefined {
        return this.data.ip;
    }

    public revoke(): void {
        this.data.isRevoked = true;
        this.apply(new OnSessionRevokedEvent(this));
        this.updated();
    }

    validate(): void {
        try {
            SessionSchema.parse(this.data);
        } catch (error) {
            if (error instanceof ZodError) {
                throw new GenericInternalValidationException(error);
            }

            throw new GenericInternalValidationException();
        }
    }
}
