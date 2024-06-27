import type { User } from '../user.entity';

export class OnUserCreatedEvent {
    constructor(public readonly user: User) {}
}
