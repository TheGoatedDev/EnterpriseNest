import { User } from '@/application/modules/user/entity/user.entity';

export class V1LoginCommand {
    constructor(
        public readonly user: User,
        public readonly ip?: string,
    ) {}
}
