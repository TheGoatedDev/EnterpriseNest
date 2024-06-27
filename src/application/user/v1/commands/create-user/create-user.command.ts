import { User } from '@/domain/user/user.entity';

export class V1CreateUserCommand {
    constructor(public readonly user: User) {}
}
