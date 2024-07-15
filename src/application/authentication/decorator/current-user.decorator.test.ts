import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';

import { CurrentUserFactory } from '@/application/authentication/decorator/current-user.decorator';

describe('current user decorator', () => {
    it('should return the current user', () => {
        // Mock user object
        const user = { userId: '123', username: 'testUser' };

        // Mock request object
        const request = {
            user,
        };

        // Mock ExecutionContext
        const context = createMock<ExecutionContext>();
        context.switchToHttp = jest.fn().mockReturnValue({
            getRequest: () => request,
        });

        // Invoke CurrentUser decorator with mocked context
        const result = CurrentUserFactory(null, context);

        // Assert that the decorator returns the expected user object
        expect(result).toBe(user);
    });

    it('should return undefined if the user is not present', () => {
        // Mock request object
        const request = {};

        // Mock ExecutionContext
        const context = createMock<ExecutionContext>();
        context.switchToHttp = jest.fn().mockReturnValue({
            getRequest: () => request,
        });

        // Invoke CurrentUser decorator with mocked context
        const result = CurrentUserFactory(null, context);

        // Assert that the decorator returns null
        expect(result).toBeUndefined();
    });
});
