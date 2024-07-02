import { User } from '@/domain/user/user.entity';

export class V1RefreshTokenCommand {
    constructor(
        public readonly user: User,
        public readonly refreshToken: string,
        public readonly ip?: string,
    ) {}
}
