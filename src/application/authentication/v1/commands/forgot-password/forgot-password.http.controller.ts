import { Body, Controller, Post, Req } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { Public } from '@/application/authentication/decorator/public.decorator';
import { V1ForgotPasswordCommandHandler } from '@/application/authentication/v1/commands/forgot-password/forgot-password.handler';
import { V1FindUserByEmailQueryHandler } from '@/application/user/v1/queries/find-user-by-email/find-user-by-email.handler';
import { ApiStandardisedResponse } from '@/shared/decorator/api-standardised-response.decorator';
import { GenericNotFoundException } from '@/shared/exceptions/not-found.exception';
import type { RequestWithUser } from '@/types/express/request-with-user';

import { V1ForgotPasswordRequestDto } from './dto/forgot-password.request.dto';

@ApiTags('Authentication')
@Controller({
    version: '1',
})
export class V1ForgotPasswordController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    @ApiOperation({
        summary:
            'User Forgot Password and send Email with Reset Password Token',
    })
    // Throttle the forgot-password endpoint to prevent brute force attacks (1 Requests per 1 minute)
    @ApiStandardisedResponse({
        status: 201,
        description: 'Forgot Password Email Sent Successfully',
    })
    @ApiStandardisedResponse({
        status: 404,
        description: 'User is not found',
    })
    @Post('/authentication/forgot-password')
    @Public()
    @Throttle({
        default: {
            limit: 1,
            ttl: 60 * 1000,
        },
    })
    async forgotPassword(
        @Req() request: RequestWithUser,
        @Body() body: V1ForgotPasswordRequestDto,
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

        await V1ForgotPasswordCommandHandler.runHandler(this.commandBus, {
            user,
            ip: request.ip,
        });

        return Promise.resolve();
    }
}
