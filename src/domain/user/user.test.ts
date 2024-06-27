import { GenericInternalValidationException } from '@/shared/exceptions/internal-validation.exception';

import { CreateUserMock, User } from './user.entity';
import type { CreateUserProps } from './user.types';
import { UserRoleEnum } from './user-role.enum';

describe('user', () => {
    let user: User;

    beforeEach(() => {
        user = CreateUserMock();
    });

    test('user can be created', () => {
        expect(user.isPasswordHashed).toBe(true);
        expect(user.id).toBeDefined();
    });

    test('user first name can be updated', () => {
        user.firstName = 'Jane';
        expect(user.firstName).toBe('Jane');
    });

    test('user last name can be updated', () => {
        user.lastName = 'Smith';
        expect(user.lastName).toBe('Smith');
    });

    test('user email can be updated', () => {
        user.email = 'oof@email.com';
        expect(user.email).toBe('oof@email.com');
    });

    test('user password can be updated', () => {
        user.password = 'Password123!';
        expect(user.password).toBe('Password123!');
        expect(user.isPasswordHashed).toBe(false);
    });

    test('user User Role can be admin and reviewer and user and admin read-only', () => {
        user.makeAdmin();
        expect(user.role).toBe(UserRoleEnum.ADMIN);
        user.makeUser();
        expect(user.role).toBe(UserRoleEnum.USER);
    });

    test('validationException thrown when invalid data provided', () => {
        const invalidUserDataMock: CreateUserProps = {
            email: 'john.doe',
            password: 'password',
        };

        expect(() => {
            User.create(invalidUserDataMock);
        }).toThrow(GenericInternalValidationException);
    });

    // added
    test('user User Role can be updated', () => {
        user.role = UserRoleEnum.DEVELOPER;
        expect(user.role).toBe(UserRoleEnum.DEVELOPER);
    });
});
