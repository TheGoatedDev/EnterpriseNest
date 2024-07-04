import { User } from '@/domain/user/user.entity';

export class OnVerificationTokenGeneratedEvent {
    constructor(
        public readonly verificationToken: string,
        public readonly user: User,
    ) {}
}
