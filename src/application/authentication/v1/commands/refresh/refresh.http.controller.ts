import { Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '@/application/authentication/decorator/current-user.decorator';
import { Public } from '@/application/authentication/decorator/public.decorator';
import { RefreshTokenGuard } from '@/application/authentication/strategies/refresh-token/refresh-token.guard';
import { V1RefreshTokenCommandHandler } from '@/application/authentication/v1/commands/refresh/refresh.handler';
import { User } from '@/domain/user/user.entity';
import { ApiStandardisedResponse } from '@/shared/decorator/api-standardised-response.decorator';
import type { RequestWithUser } from '@/types/express/request-with-user';

import { V1RefreshTokenResponseDto } from './dto/refresh.response.dto';

@ApiTags('Authentication')
@Controller({
    version: '1',
})
export class V1RefreshTokenController {
    constructor(private readonly commandBus: CommandBus) {}

    @ApiOperation({
        summary:
            'RefreshToken to a User Account and get access and refresh token',
    }) // This is to bypass the AccessTokenGuard
    @ApiSecurity('refresh-token')
    @ApiStandardisedResponse(
        {
            status: 201,
            description: 'Tokens Refreshed Successfully',
        },
        V1RefreshTokenResponseDto,
    )
    @ApiStandardisedResponse({
        status: 401,
        description: 'User is Not Verified or Email or Password is Incorrect',
    })
    @HttpCode(201)
    @Post('/authentication/refresh')
    @Public()
    @UseGuards(RefreshTokenGuard)
    async refreshToken(
        @Req() request: RequestWithUser,
        @CurrentUser() user: User,
    ): Promise<V1RefreshTokenResponseDto> {
        return V1RefreshTokenCommandHandler.runHandler(this.commandBus, {
            user,
            session: request.session,
            ip: request.ip,
        });
    }
}
