import { BaseTokenPayload } from '@/domain/token/base-token-payload.type';

export type VerificationTokenPayload = BaseTokenPayload<
    'verification',
    {
        sub: string;
    }
>;
