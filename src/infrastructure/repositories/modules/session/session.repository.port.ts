import { Session } from '@/domain/session/session.entity';
import { User } from '@/domain/user/user.entity';
import { RepositoryPort } from '@/infrastructure/repositories/repository.port';

export interface SessionRepositoryPort extends RepositoryPort<Session> {
    findAllByUserID: (userID: string) => Promise<Session[]>;
    findAllByUser: (user: User) => Promise<Session[]>;

    findOneByToken: (token: string) => Promise<Session | undefined>;

    findAllRevoked: () => Promise<Session[]>;
    findAllNotRevoked: () => Promise<Session[]>;

    findAllByIP: (ip: string) => Promise<Session[]>;
}
