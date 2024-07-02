import type { User } from '../user.entity';
import type { UserRoleEnum } from '../user-role.enum';

export class OnUserChangedRoleEvent {
    constructor(
        public readonly user: User,
        public readonly oldRole: UserRoleEnum,
        public readonly newRole: UserRoleEnum,
    ) {}
}
