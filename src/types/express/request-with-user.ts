import { Request } from 'express';

import { User } from '@/application/modules/user/entity/user.entity';

export interface RequestWithUser extends Request {
    user?: User;
}
