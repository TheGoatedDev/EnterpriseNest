import { User } from '@/domain/user/user.entity';

export class OnVerificationConfirmedEvent {
    constructor(public readonly user: User) {}
}
