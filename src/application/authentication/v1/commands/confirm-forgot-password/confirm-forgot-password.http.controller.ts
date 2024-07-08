import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { Public } from '@/application/authentication/decorator/public.decorator';
import { V1ConfirmForgotPasswordCommandHandler } from '@/application/authentication/v1/commands/confirm-forgot-password/confirm-forgot-password.handler';
import { ApiStandardisedResponse } from '@/shared/decorator/api-standardised-response.decorator';

import { V1ConfirmForgotPasswordRequestDto } from './dto/confirm-forgot-password.request.dto';

@ApiTags('Authentication')
@Controller({
    version: '1',
})
export class V1ConfirmForgotPasswordController {
    constructor(private readonly commandBus: CommandBus) {}

    @ApiOperation({
        summary:
            'Confirm Forgot Password - Confirm the forgot password request and reset the password',
    })
    // Throttle the confirm-forgot-password endpoint to prevent brute force attacks (5 Requests per 1 minute)
    @ApiStandardisedResponse({
        status: 200,
        description: 'Password has been reset successfully',
    })
    @ApiStandardisedResponse({
        status: 404,
        description: 'User is not found',
    })
    @HttpCode(200)
    @Post('/authentication/confirm-forgot-password')
    @Public()
    @Throttle({
        default: {
            limit: 5,
            ttl: 60 * 1000,
        },
    })
    async confirmForgotPassword(
        @Body() body: V1ConfirmForgotPasswordRequestDto,
    ): Promise<void> {
        await V1ConfirmForgotPasswordCommandHandler.runHandler(
            this.commandBus,
            {
                resetPasswordToken: body.resetPasswordToken,
                newPassword: body.password,
            },
        );

        return Promise.resolve();
    }
}
