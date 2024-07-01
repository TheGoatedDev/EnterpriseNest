import { BaseTokenPayload } from '@/domain/jwt/base-token-payload.type';

export type RefreshTokenPayload = BaseTokenPayload<
    'refresh-token',
    {
        token: string;
        ip?: string;
    }
>;
