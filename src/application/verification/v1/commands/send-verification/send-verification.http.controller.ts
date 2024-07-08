import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { Public } from '@/application/authentication/decorator/public.decorator';
import { V1FindUserByEmailQueryHandler } from '@/application/user/v1/queries/find-user-by-email/find-user-by-email.handler';
import { V1SendVerificationCommandHandler } from '@/application/verification/v1/commands/send-verification/send-verification.handler';
import { UserAlreadyVerifiedException } from '@/domain/user/exceptions/user-already-verified.exception';
import { ApiStandardisedResponse } from '@/shared/decorator/api-standardised-response.decorator';
import { GenericNotFoundException } from '@/shared/exceptions/not-found.exception';

import { V1SendVerificationRequestDto } from './dto/send-verification.request.dto';

@ApiTags('Verification')
@Controller({
    version: '1',
})
export class V1SendVerificationController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    @ApiOperation({
        summary: 'Send Verification Email',
    })
    // Throttle the confirm-verification endpoint to prevent brute force attacks (5 Requests per 1 hour)
    @ApiStandardisedResponse({
        status: 200,
        description: 'Verification Email Sent Successfully',
    })
    @ApiStandardisedResponse({
        status: 403,
        description: 'User not found or already verified',
    })
    @HttpCode(200)
    @Post('/verification/send')
    @Public()
    @Throttle({
        default: {
            limit: 5,
            ttl: 60 * 60 * 1000,
        },
    })
    async sendVerification(
        @Body() body: V1SendVerificationRequestDto,
    ): Promise<void> {
        const user = await V1FindUserByEmailQueryHandler.runHandler(
            this.queryBus,
            {
                email: body.email,
            },
        );

        if (!user) {
            throw new GenericNotFoundException('User not found');
        }

        if (user.verifiedAt) {
            throw new UserAlreadyVerifiedException();
        }

        await V1SendVerificationCommandHandler.runHandler(this.commandBus, {
            user,
        });

        return Promise.resolve();
    }
}
