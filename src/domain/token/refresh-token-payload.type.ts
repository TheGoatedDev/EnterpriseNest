import { BaseTokenPayload } from '@/domain/token/base-token-payload.type';

export type RefreshTokenPayload = BaseTokenPayload<
    'refresh-token',
    {
        token: string;
        ip?: string;
    }
>;
