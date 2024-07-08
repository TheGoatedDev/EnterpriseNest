import { User } from '@/domain/user/user.entity';

export class OnLoginUnverifiedEvent {
    constructor(
        public readonly user: User,
        public readonly ip?: string,
    ) {}
}
