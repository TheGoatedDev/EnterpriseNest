import type { User } from '../user.entity';

export class OnUserChangedLastNameEvent {
    constructor(
        public readonly user: User,
        public readonly oldLastName: string | undefined,
        public readonly newLastName: string | undefined,
    ) {}
}
