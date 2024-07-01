import { type ClassProvider, Injectable } from '@nestjs/common';

import { Session } from '@/domain/session/session.entity';
import { User } from '@/domain/user/user.entity';
import { AbstractMockRepository } from '@/infrastructure/repositories/modules/mock/abstracts/mock.repository';
import { SESSION_REPOSITORY } from '@/infrastructure/repositories/modules/session/session.repository.constants';
import { SessionRepositoryPort } from '@/infrastructure/repositories/modules/session/session.repository.port';

@Injectable()
export class MockSessionRepository
    extends AbstractMockRepository<Session>
    implements SessionRepositoryPort
{
    findAllByUserID: (userID: string) => Promise<Session[]> = async (
        userID: string,
    ) => {
        return Promise.resolve(
            this.data.filter((session) => session.userId === userID),
        );
    };
    findAllByUser: (user: User) => Promise<Session[]> = async (user: User) => {
        return Promise.resolve(
            this.data.filter((session) => session.userId === user.id),
        );
    };

    findOneByToken: (token: string) => Promise<Session | undefined> = async (
        token: string,
    ) => {
        return Promise.resolve(
            this.data.find((session) => session.token === token),
        );
    };
    findAllRevoked: () => Promise<Session[]> = async () =>
        Promise.resolve(this.data.filter((session) => session.isRevoked));
    findAllNotRevoked: () => Promise<Session[]> = async () =>
        Promise.resolve(this.data.filter((session) => !session.isRevoked));
    findAllByIP: (ip: string) => Promise<Session[]> = async (ip: string) =>
        Promise.resolve(this.data.filter((session) => session.ip === ip));
}

export const MockSessionRepositoryProvider: ClassProvider = {
    provide: SESSION_REPOSITORY,
    useClass: MockSessionRepository,
};
