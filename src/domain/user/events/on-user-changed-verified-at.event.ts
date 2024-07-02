import type { User } from '../user.entity';

export class OnUserChangedVerifiedAtEvent {
    constructor(
        public readonly user: User,
        public readonly oldVerifiedAt: Date | undefined,
        public readonly newVerifiedAt: Date | undefined,
    ) {}
}
