import { User as BaseUser } from '@/domain/user/user.entity';

export {};

declare global {
    namespace Express {
        export type User = BaseUser;

        interface Request {
            user?: User;
        }
    }
}
