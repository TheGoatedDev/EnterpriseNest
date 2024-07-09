import { faker } from '@faker-js/faker';

import { Session } from '@/domain/session/session.entity';
import { User } from '@/domain/user/user.entity';

export const CreateMockUser = (hashedPassword = true): User =>
    User.create({
        email: faker.internet.email(),
        password: hashedPassword
            ? '$argon2id$v=19$m=16,t=2,p=1$RElXV3FhVHVuZFdXNTJGaw$qokKchd/Ye41cx3LajbZXQ'
            : 'Password123!',
    });

export const CreateMockSession = (user: User = CreateMockUser()): Session =>
    Session.create({
        userId: user.id,
        ip: faker.internet.ip(),
    });
