import { User as BaseUser } from '@/domain/user/user.entity';

declare global {
    namespace Express {
        export type User = BaseUser;

        interface Request {
            user?: User;
        }
    }
}
