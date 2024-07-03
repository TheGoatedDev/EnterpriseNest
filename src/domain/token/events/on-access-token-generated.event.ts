import { Session } from '@/domain/session/session.entity';

export class OnAccessTokenGeneratedEvent {
    constructor(
        public readonly session: Session,
        public readonly accessToken: string,
    ) {}
}
