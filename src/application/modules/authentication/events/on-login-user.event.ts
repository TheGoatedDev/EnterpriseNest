import { User } from '@/application/modules/user/entity/user.entity';

export class OnLoginUserEvent {
    constructor(
        public readonly user: User,
        public readonly ip?: string,
    ) {}
}
