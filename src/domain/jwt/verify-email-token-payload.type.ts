import { BaseTokenPayload } from '@/domain/jwt/base-token-payload.type';

export type VerifyEmailTokenPayload = BaseTokenPayload<
    'verify-email',
    {
        sub: string;
    }
>;
