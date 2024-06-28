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
import { V1LoginCommandHandler } from '@/application/authentication/v1/commands/login/login.handler';
import { ApiStandardisedResponse } from '@/shared/decorator/api-standardised-response.decorator';
import type { RequestWithUser } from '@/types/express/request-with-user';

import { V1LoginRequestDto } from './dto/login.request.dto';
import { V1LoginResponseDto } from './dto/login.response.dto';

@ApiTags('Authentication')
@Controller({
    version: '1',
})
export class V1LoginController {
    constructor(private readonly commandBus: CommandBus) {}

    @Public()
    // Throttle the login endpoint to prevent brute force attacks (5 Requests per 1 minute)
    @Throttle({
        default: {
            limit: 5,
            ttl: 60 * 1000,
        },
    })
    @UseGuards(LocalAuthGuard)
    @Post('/authentication/login')
    @ApiOperation({
        summary: 'Login to a User Account and get access and refresh token',
    })
    @ApiStandardisedResponse(
        {
            status: 200,
            description: 'User Logged In Successfully',
        },
        V1LoginResponseDto,
    )
    @ApiStandardisedResponse({
        status: 401,
        description: 'User is Not Verified or Email or Password is Incorrect',
    })
    @ApiBody({ type: V1LoginRequestDto })
    async login(@Req() request: RequestWithUser): Promise<V1LoginResponseDto> {
        const user = request.user;

        if (!user) {
            throw new UnauthorizedException("Email or password doesn't match");
        }

        return V1LoginCommandHandler.runHandler(this.commandBus, {
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
