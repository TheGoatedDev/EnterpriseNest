import type { User } from '../user.entity';

export class OnUserChangedFirstNameEvent {
    constructor(
        public readonly user: User,
        public readonly oldFirstName: string | undefined,
        public readonly newFirstName: string | undefined,
    ) {}
}
