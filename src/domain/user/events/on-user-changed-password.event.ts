import type { User } from '../user.entity';

export class OnUserChangedPasswordEvent {
    constructor(public readonly user: User) {}
}
