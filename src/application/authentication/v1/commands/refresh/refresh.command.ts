import { Session } from '@/domain/session/session.entity';
import { User } from '@/domain/user/user.entity';

export class V1RefreshTokenCommand {
    constructor(
        public readonly user: User,
        public readonly session: Session,
        public readonly ip?: string,
    ) {}
}
