import { CreateMockUser } from '@tests/utils/create-mocks';

import { User } from '@/domain/user/user.entity';
import { GenericInternalValidationException } from '@/shared/exceptions/internal-validation.exception';

import { Session } from './session.entity';

describe('session', () => {
    let session: Session;
    let user: User;

    beforeEach(() => {
        user = CreateMockUser();

        session = Session.create({
            userId: user.id,
            ip: '1.1.1.1',
        });
    });

    test('create() should create a valid session instance', () => {
        expect(session.id).toBeDefined();
        expect(session.isRevoked).toBeFalsy();
        expect(session.userId).toEqual(user.id);
        expect(session.token).toBeDefined();
        expect(session.ip).toBeDefined();
    });

    test('create() should not have a ip is not provided one', () => {
        const tempSession = Session.create({
            userId: user.id,
        });
        expect(tempSession.getData().ip).toBeUndefined();
    });

    test('revoke() should mark the session as revoked', () => {
        expect(session.getData().isRevoked).toBeFalsy();
        session.revoke();
        expect(session.getData().isRevoked).toBeTruthy();
    });

    test('validate() should not throw exception for a valid session', () => {
        expect(() => {
            session.validate();
        }).not.toThrow();
    });

    test('validate() should throw exception for an invalid ip', () => {
        expect(() => {
            Session.create({ userId: user.id, ip: 'invalid-ip' });
        }).toThrow(GenericInternalValidationException);
    });
});
