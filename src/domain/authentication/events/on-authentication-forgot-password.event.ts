import { User } from '@/domain/user/user.entity';

export class OnAuthenticationForgotPasswordEvent {
    constructor(
        public readonly user: User,
        public readonly resetPasswordToken: string,
        public readonly ip?: string,
    ) {}
}
