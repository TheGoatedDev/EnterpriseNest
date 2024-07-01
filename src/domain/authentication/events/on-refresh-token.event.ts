import { User } from '@/domain/user/user.entity';

export class OnRefreshTokenEvent {
    constructor(public readonly user: User) {}
}
