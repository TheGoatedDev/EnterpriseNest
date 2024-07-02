import { User } from '@/domain/user/user.entity';

export class OnVerificationSentEvent {
    constructor(
        public readonly user: User,
        public readonly verificationToken: string,
    ) {}
}
