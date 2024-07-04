import { User } from '@/domain/user/user.entity';

export class V1GenerateVerificationTokenCommand {
    constructor(public readonly user: User) {}
}
