import { BaseTokenPayload } from '@/domain/jwt/base-token-payload.type';

export type RefreshTokenPayload = BaseTokenPayload<
    'refresh-token',
    {
        uuid: string;
        ip?: string;
    }
>;