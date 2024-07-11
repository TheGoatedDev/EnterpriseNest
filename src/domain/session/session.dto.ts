import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsIP, IsOptional } from 'class-validator';

import { ID } from '@/domain/base/entity/entity.base.dto';
import { IsCuid } from '@/shared/decorator/validation/is-cuid.decorator';

export const SessionUserId = () => ID('User');

export class SessionUserIdDto {
    @SessionUserId()
    userId!: string;
}

export const SessionToken = () =>
    applyDecorators(
        ApiProperty({
            description: 'The token of the session',
            example:
                "export type CreateSessionProps = Omit<SessionProps, 'token' | 'isRevoked'>;",
            type: String,
            required: true,
        }),
        IsCuid(),
    );

export class SessionTokenDto {
    @SessionToken()
    token!: string;
}

export const SessionIsRevoked = () =>
    applyDecorators(
        ApiProperty({
            description: 'If the session is revoked',
            example: false,
            type: Boolean,
            required: true,
        }),
    );

export class SessionIsRevokedDto {
    @SessionIsRevoked()
    isRevoked!: boolean;
}

export const SessionIp = () =>
    applyDecorators(
        ApiProperty({
            description: 'The IP of the session (if available)',
            example: '1.1.1.1',
            type: String,
        }),
        IsIP(),
        IsOptional(),
    );

export class SessionIpDto {
    @SessionIp()
    ip?: string;
}
