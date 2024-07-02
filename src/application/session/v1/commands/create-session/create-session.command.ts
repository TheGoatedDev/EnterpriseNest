import { User } from '@/domain/user/user.entity';

export class V1CreateSessionCommand {
    constructor(
        public readonly user: User,
        public readonly ip?: string,
    ) {}
}
