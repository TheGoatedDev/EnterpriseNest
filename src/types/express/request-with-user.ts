import { Request } from 'express';

import { Session } from '@/domain/session/session.entity';
import { User } from '@/domain/user/user.entity';

export interface RequestWithUser extends Request {
    user: User;
    session: Session;
}
