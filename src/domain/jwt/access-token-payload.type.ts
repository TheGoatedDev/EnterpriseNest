import { BaseTokenPayload } from '@/domain/jwt/base-token-payload.type';

export type AccessTokenPayload = BaseTokenPayload<
    'access-token',
    {
        sub: string;
        ip?: string;
    }
>;
