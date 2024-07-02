import { BaseTokenPayload } from '@/domain/jwt/base-token-payload.type';

export type AccessTokenPayload = BaseTokenPayload<
    'access-token',
    {
        sub: string;
        refreshToken: string;
        ip?: string;
    }
>;
