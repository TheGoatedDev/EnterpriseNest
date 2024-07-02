import { User } from '@/domain/user/user.entity';

export class V1FindAllSessionsByUserQuery {
    constructor(public readonly user: User) {}
}
