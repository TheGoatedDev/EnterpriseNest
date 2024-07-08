import { Session } from '@/domain/session/session.entity';
import { User } from '@/domain/user/user.entity';

export class OnTokenRefreshEvent {
    constructor(
        public readonly user: User,
        public readonly session: Session,
        public readonly newAccessToken: string,
    ) {}
}
