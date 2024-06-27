import { User } from '@/domain/user/user.entity';

export class OnLoginUserEvent {
    constructor(
        public readonly user: User,
        public readonly ip?: string,
    ) {}
}
