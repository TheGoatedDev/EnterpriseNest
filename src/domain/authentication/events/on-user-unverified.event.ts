import { User } from '@/domain/user/user.entity';

export class OnUserUnverifiedEvent {
    constructor(
        public readonly user: User,
        public readonly ip?: string,
    ) {}
}
