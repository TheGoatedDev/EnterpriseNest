import type { User } from '../entity/user.entity';
import type { UserRoleEnum } from '../entity/user-role.enum';

export class OnUserChangedRoleEvent {
    constructor(
        public readonly user: User,
        public readonly oldRole: UserRoleEnum,
        public readonly newRole: UserRoleEnum,
    ) {}
}
