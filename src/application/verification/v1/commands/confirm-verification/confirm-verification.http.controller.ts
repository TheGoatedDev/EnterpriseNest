import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { Public } from '@/application/authentication/decorator/public.decorator';
import { V1ConfirmVerificationCommandHandler } from '@/application/verification/v1/commands/confirm-verification/confirm-verification.handler';
import { ApiStandardisedResponse } from '@/shared/decorator/api-standardised-response.decorator';

import { V1ConfirmVerificationRequestDto } from './dto/confirm-verification.request.dto';

@ApiTags('Verification')
@Controller({
    version: '1',
})
export class V1ConfirmVerificationController {
    constructor(private readonly commandBus: CommandBus) {}

    @ApiOperation({
        summary: 'Confirm Verification Email',
    })
    // Throttle the confirm-verification endpoint to prevent brute force attacks (5 Requests per 1 hour)
    @ApiStandardisedResponse({
        status: 200,
        description: 'Verification Completed Successfully',
    })
    @ApiStandardisedResponse({
        status: 403,
        description: 'User not found or Token is invalid',
    })
    @HttpCode(200)
    @Post('/verification/confirm')
    @Public()
    @Throttle({
        default: {
            limit: 5,
            ttl: 60 * 60 * 1000,
        },
    })
    async confirmVerification(
        @Body() body: V1ConfirmVerificationRequestDto,
    ): Promise<void> {
        await V1ConfirmVerificationCommandHandler.runHandler(this.commandBus, {
            verificationToken: body.verificationToken,
        });

        return Promise.resolve();
    }
}
