import {
    Controller,
    Post,
    Req,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { Public } from '@/application/authentication/decorator/public.decorator';
import { LocalAuthGuard } from '@/application/authentication/strategies/local/local.guard';
import { V1RefreshTokenCommandHandler } from '@/application/authentication/v1/commands/refresh-token/refresh-token.handler';
import { ApiStandardisedResponse } from '@/shared/decorator/api-standardised-response.decorator';
import type { RequestWithUser } from '@/types/express/request-with-user';

import { V1RefreshTokenRequestDto } from './dto/refresh-token.request.dto';
import { V1RefreshTokenResponseDto } from './dto/refresh-token.response.dto';

@ApiTags('Authentication')
@Controller({
    version: '1',
})
export class V1RefreshTokenController {
    constructor(private readonly commandBus: CommandBus) {}

    @Public()
    // Throttle the refresh-token endpoint to prevent brute force attacks (5 Requests per 1 minute)
    @Throttle({
        default: {
            limit: 5,
            ttl: 60 * 1000,
        },
    })
    @UseGuards(LocalAuthGuard)
    @Post('/authentication/refresh-token')
    @ApiOperation({
        summary:
            'RefreshToken to a User Account and get access and refresh token',
    })
    @ApiStandardisedResponse(
        {
            status: 200,
            description: 'User Logged In Successfully',
        },
        V1RefreshTokenResponseDto,
    )
    @ApiStandardisedResponse({
        status: 401,
        description: 'User is Not Verified or Email or Password is Incorrect',
    })
    @ApiBody({ type: V1RefreshTokenRequestDto })
    async refreshToken(
        @Req() request: RequestWithUser,
    ): Promise<V1RefreshTokenResponseDto> {
        const user = request.user;

        if (!user) {
            throw new UnauthorizedException("Email or password doesn't match");
        }

        return V1RefreshTokenCommandHandler.runHandler(this.commandBus, {
            user,
            ip: request.ip,
        }).then((token) => {
            return {
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
            };
        });
    }
}
