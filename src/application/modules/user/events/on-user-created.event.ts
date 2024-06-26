import type { User } from '../entity/user.entity';

export class OnUserCreatedEvent {
    constructor(public readonly user: User) {}
}
