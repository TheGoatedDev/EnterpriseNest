import { RepositoryPort } from '@/core/ports/repository.port';

import type { User } from '../entity/user.entity';

export interface UserRepositoryPort extends RepositoryPort<User> {
    findOneByEmail: (email: string) => Promise<User | undefined>;
}
