import { User } from '@/domain/user/user.entity';

export class OnResetPasswordTokenGeneratedEvent {
    constructor(
        public readonly resetPasswordToken: string,
        public readonly user: User,
    ) {}
}
