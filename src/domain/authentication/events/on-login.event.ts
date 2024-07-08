import { User } from '@/domain/user/user.entity';

export class OnLoginEvent {
    constructor(
        public readonly user: User,
        public readonly ip?: string,
    ) {}
}
