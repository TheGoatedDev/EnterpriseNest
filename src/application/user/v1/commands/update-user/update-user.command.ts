import { User } from '@/domain/user/user.entity';

export class V1UpdateUserCommand {
    constructor(public readonly user: User) {}
}
