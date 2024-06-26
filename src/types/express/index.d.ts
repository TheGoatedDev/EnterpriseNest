import { User as BaseUser } from '@/application/modules/user/entity/user.entity';

export {};

declare global {
    namespace Express {
        export type User = BaseUser;

        interface Request {
            user?: User;
        }
    }
}
