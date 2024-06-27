import type { User } from '@/domain/user/user.entity';
import { RepositoryPort } from '@/infrastructure/repositories/repository.port';

export interface UserRepositoryPort extends RepositoryPort<User> {
    findOneByEmail: (email: string) => Promise<User | undefined>;
}
