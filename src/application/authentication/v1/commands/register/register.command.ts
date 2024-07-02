import { User } from '@/domain/user/user.entity';

export class V1RegisterCommand {
    constructor(
        public readonly user: User,
        public readonly ip?: string,
    ) {}
}
