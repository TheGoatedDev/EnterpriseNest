import { User } from '@/domain/user/user.entity';

export class V1DeleteUserCommand {
    constructor(public readonly user: User) {}
}
