import type { User } from '../user.entity';

export class OnUserChangedEmailEvent {
    constructor(
        public readonly user: User,
        public readonly oldEmail: string,
        public readonly newEmail: string,
    ) {}
}
