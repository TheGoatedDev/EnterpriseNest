import { Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { Public } from '@/application/authentication/decorator/public.decorator';
import { RefreshTokenGuard } from '@/application/authentication/strategies/refresh-token/refresh-token.guard';
import { V1RevokeSessionCommandHandler } from '@/application/session/v1/commands/revoke-session/revoke-session.handler';
import { ApiStandardisedResponse } from '@/shared/decorator/api-standardised-response.decorator';
import type { RequestWithUser } from '@/types/express/request-with-user';

@ApiTags('Authentication')
@Controller({
    version: '1',
})
export class V1LogoutController {
    constructor(private readonly commandBus: CommandBus) {}

    @ApiOperation({
        summary: 'Logout a User Account and invalidate the refresh token',
    }) // This is to bypass the AccessTokenGuard
    @ApiSecurity('refresh-token')
    @ApiStandardisedResponse({
        status: 200,
        description: 'User Logged Out Successfully',
    })
    @HttpCode(200)
    @Post('/authentication/logout')
    @Public()
    @UseGuards(RefreshTokenGuard)
    async refreshToken(@Req() request: RequestWithUser): Promise<void> {
        await V1RevokeSessionCommandHandler.runHandler(this.commandBus, {
            session: request.session,
        });
    }
}
