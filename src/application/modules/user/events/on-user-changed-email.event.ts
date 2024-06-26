import type { User } from '../entity/user.entity';

export class OnUserChangedEmailEvent {
    constructor(
        public readonly user: User,
        public readonly oldEmail: string,
        public readonly newEmail: string,
    ) {}
}
