import { User } from '@/domain/user/user.entity';

export class V1GenerateResetPasswordTokenCommand {
    constructor(public readonly user: User) {}
}
