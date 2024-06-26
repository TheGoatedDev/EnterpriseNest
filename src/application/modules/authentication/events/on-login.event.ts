import { User } from '@/core/entities/user/user.entity';

export class OnLoginEvent {
    constructor(
        public readonly user: User,
        public readonly token: string,
        public readonly ip?: string,
    ) {}
}
