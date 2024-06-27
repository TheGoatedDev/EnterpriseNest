import {
    Controller,
    Post,
    Req,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { Public } from '@/application/modules/authentication/decorator/public.decorator';
import { LocalAuthGuard } from '@/application/modules/authentication/strategies/local/local.guard';
import { V1LoginCommandHandler } from '@/application/modules/authentication/v1/commands/login/login.handler';
import { OnLoginUserEvent } from '@/domain/authentication/events/on-login-user.event';
import { ApiStandardisedResponse } from '@/shared/decorator/api-standardised-response.decorator';
import type { RequestWithUser } from '@/types/express/request-with-user';

import { V1LoginRequestDto } from './dto/login.request.dto';
import { V1LoginResponseDto } from './dto/login.response.dto';

@ApiTags('Authentication')
@Controller({
    version: '1',
})
export class V1LoginController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly eventBus: EventBus,
    ) {}

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
            description: 'Session Tokens',
        },
        V1LoginResponseDto,
    )
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
            this.eventBus.publish(new OnLoginUserEvent(user, request.ip));

            return {
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
            };
        });
    }
}
