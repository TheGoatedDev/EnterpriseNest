import { User } from '@/application/modules/user/entity/user.entity';

export class V1CreateUserCommand {
    constructor(public readonly user: User) {}
}
