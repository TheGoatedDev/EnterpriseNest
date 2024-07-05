import { BaseTokenPayload } from '@/domain/token/base-token-payload.type';

export type ResetPasswordTokenPayload = BaseTokenPayload<
    'reset-password',
    {
        sub: string;
    }
>;
