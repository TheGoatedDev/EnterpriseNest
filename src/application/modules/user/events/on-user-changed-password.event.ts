import type { User } from '../entity/user.entity';

export class OnUserChangedPasswordEvent {
    constructor(public readonly user: User) {}
}
