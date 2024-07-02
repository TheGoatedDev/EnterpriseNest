import { User } from '@/domain/user/user.entity';

export class OnRegisterUserEvent {
    constructor(
        public readonly user: User,
        public readonly ip?: string,
    ) {}
}
