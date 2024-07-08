import { User } from '@/domain/user/user.entity';

export class OnConfirmForgotPasswordEvent {
    constructor(public readonly user: User) {}
}
