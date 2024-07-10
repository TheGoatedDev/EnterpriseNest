import { User } from '@/domain/user/user.entity';

export class OnRegisterEvent {
    constructor(
        public readonly user: User,
        public readonly ip?: string,
    ) {}
}
