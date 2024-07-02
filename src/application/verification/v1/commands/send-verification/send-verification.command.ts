import { User } from '@/domain/user/user.entity';

export class V1SendVerificationCommand {
    constructor(public readonly user: User) {}
}
