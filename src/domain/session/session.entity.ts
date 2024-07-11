import { IntersectionType } from '@nestjs/swagger';
import { createId } from '@paralleldrive/cuid2';
import { Expose, plainToInstance } from 'class-transformer';

import { Entity } from '@/domain/base/entity/entity.base';
import { OnSessionRevokedEvent } from '@/domain/session/events/on-session-revoked.event';
import {
    SessionIp,
    SessionIpDto,
    SessionIsRevoked,
    SessionIsRevokedDto,
    SessionToken,
    SessionTokenDto,
    SessionUserId,
    SessionUserIdDto,
} from '@/domain/session/session.dto';
import { AllStaffRoles } from '@/domain/user/user-role.enum';

export class SessionData extends IntersectionType(
    SessionUserIdDto,
    SessionTokenDto,
    SessionIsRevokedDto,
    SessionIpDto,
) {}

export interface CreateSessionProps {
    userId: string;
    ip?: string;
}

export class Session extends Entity<SessionData> {
    static create(props: CreateSessionProps): Session {
        const id = createId();

        const data: SessionData = plainToInstance(SessionData, {
            ...props,
            isRevoked: false,
            token: createId(),
        });

        return new Session({ id, data });
    }

    @Expose()
    @SessionUserId()
    get userId(): string {
        return this.data.userId;
    }

    @Expose()
    @SessionToken()
    get token(): string {
        return this.data.token;
    }

    @Expose()
    @SessionIsRevoked()
    get isRevoked(): boolean {
        return this.data.isRevoked;
    }

    @Expose({
        groups: [...AllStaffRoles],
    })
    @SessionIp()
    get ip(): string | undefined {
        return this.data.ip;
    }

    public revoke(): void {
        this.data.isRevoked = true;
        this.apply(new OnSessionRevokedEvent(this));
        this.updated();
    }
}
