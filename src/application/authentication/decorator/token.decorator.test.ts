import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';

import { TokenFactory } from '@/application/authentication/decorator/token.decorator';

describe('token decorator', () => {
    it('should return the token', () => {
        // Mock user object
        const token = 'Bearer TestToken';

        // Mock request object
        const request = {
            headers: {
                authorization: token,
            },
        };

        // Mock ExecutionContext
        const context = createMock<ExecutionContext>();
        context.switchToHttp = jest.fn().mockReturnValue({
            getRequest: () => request,
        });

        // Invoke CurrentUser decorator with mocked context
        const result = TokenFactory(null, context);

        // Assert that the decorator returns the expected user object
        expect(result).toBe('TestToken');
    });

    it('should return null if the token is not present', () => {
        // Mock request object
        const request = {
            headers: {
                authorization: null,
            },
        };

        // Mock ExecutionContext
        const context = createMock<ExecutionContext>();
        context.switchToHttp = jest.fn().mockReturnValue({
            getRequest: () => request,
        });

        // Invoke CurrentUser decorator with mocked context
        const result = TokenFactory(null, context);

        // Assert that the decorator returns the expected user object
        expect(result).toBeNull();
    });

    it('should return null if the token is not valid', () => {
        // Mock request object
        const request = {
            headers: {
                authorization: 'Bearer ',
            },
        };

        // Mock ExecutionContext
        const context = createMock<ExecutionContext>();
        context.switchToHttp = jest.fn().mockReturnValue({
            getRequest: () => request,
        });

        // Invoke CurrentUser decorator with mocked context
        const result = TokenFactory(null, context);

        // Assert that the decorator returns the expected user object
        expect(result).toBeNull();
    });
});
