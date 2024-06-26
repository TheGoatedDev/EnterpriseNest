import { User } from '@/application/modules/user/entity/user.entity';

export class V1UpdateUserCommand {
    constructor(public readonly user: User) {}
}
