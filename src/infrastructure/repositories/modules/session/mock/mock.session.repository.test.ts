import { CreateMockUser } from '@tests/utils/create-mocks';

import { Session } from '@/domain/session/session.entity';
import { User } from '@/domain/user/user.entity';
import { MockSessionRepository } from '@/infrastructure/repositories/modules/session/mock/mock.session.repository';

describe('mockSessionRepository', () => {
    let mockSessionRepository: MockSessionRepository;
    let testSession: Session;
    let user: User;

    beforeEach(() => {
        mockSessionRepository = new MockSessionRepository();
        user = CreateMockUser();

        testSession = Session.create({
            userId: user.id,
            ip: '1.1.1.1',
        });
    });

    test('should find a Session by userID', async () => {
        await mockSessionRepository.create(testSession);
        expect(await mockSessionRepository.findAllByUserID(user.id)).toEqual([
            testSession,
        ]);
    });

    test('should find a Session by user', async () => {
        const tempSession = Session.create({ userId: user.id, ip: '1.1.1.1' });

        await mockSessionRepository.create(tempSession);
        expect(await mockSessionRepository.findAllByUser(user)).toEqual([
            tempSession,
        ]);
    });

    test('should find a Session by token', async () => {
        await mockSessionRepository.create(testSession);
        expect(
            await mockSessionRepository.findOneByToken(testSession.token),
        ).toEqual(testSession);
    });

    test('should find all revoked Sessions', async () => {
        await mockSessionRepository.create(testSession);
        expect(await mockSessionRepository.findAllRevoked()).toHaveLength(0);
    });

    test('should find all not revoked Sessions', async () => {
        await mockSessionRepository.create(testSession);
        expect(await mockSessionRepository.findAllNotRevoked()).toHaveLength(1);
    });

    test('should find all Sessions by IP', async () => {
        await mockSessionRepository.create(testSession);
        expect(
            await mockSessionRepository.findAllByIP(testSession.ip ?? ''),
        ).toHaveLength(1);
    });
});
