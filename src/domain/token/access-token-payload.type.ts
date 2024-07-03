import { BaseTokenPayload } from '@/domain/token/base-token-payload.type';

export type AccessTokenPayload = BaseTokenPayload<
    'access-token',
    {
        sub: string;
        refreshToken: string;
        ip?: string;
    }
>;
