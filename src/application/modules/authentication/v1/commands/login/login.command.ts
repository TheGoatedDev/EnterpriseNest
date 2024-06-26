import { User } from '@/core/entities/user/user.entity';

export class V1LoginCommand {
    constructor(
        public readonly user: User,
        public readonly ip?: string,
    ) {}
}
