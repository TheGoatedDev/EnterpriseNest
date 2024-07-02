import { z } from 'zod';

import { EntityID } from '@/domain/base/entity/entity.base';

export interface SessionProps {
    token: string;
    isRevoked: boolean;
    ip?: string;
    userId: EntityID;
}

export const SessionSchema = z.object({
    token: z.string(),
    isRevoked: z.boolean(),
    ip: z.string().ip().optional(),
});

export type CreateSessionProps = Omit<SessionProps, 'token' | 'isRevoked'>;
