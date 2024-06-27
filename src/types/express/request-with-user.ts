import { Request } from 'express';

import { User } from '@/domain/user/user.entity';

export interface RequestWithUser extends Request {
    user?: User;
}
