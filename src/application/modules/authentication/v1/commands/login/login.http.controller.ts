import {
    Controller,
    Post,
    Req,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';

import { OnLoginEvent } from '@/application/modules/authentication/events/on-login.event';
import { LocalAuthGuard } from '@/application/modules/authentication/strategies/local/local.guard';
import { V1LoginCommandHandler } from '@/application/modules/authentication/v1/commands/login/login.handler';
import {
    UserNoEmailMatchException,
    UserPasswordIncorrectException,
} from '@/core/entities/user/user.errors';

import { V1LoginRequestDto } from './login.request.dto';
import { V1LoginResponseDto } from './login.response.dto';

@ApiTags('Authentication')
@Controller({
    version: '1',
})
export class V1LoginController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly eventBus: EventBus,
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('/authentication/login')
    @ApiOperation({
        summary: 'Login to a User Account and make it your current session',
    })
    @ApiOkResponse({
        type: V1LoginResponseDto,
        description: 'Session Token',
    })
    @ApiBody({ type: V1LoginRequestDto })
    async login(@Req() request: Request): Promise<V1LoginResponseDto> {
        if (!request.user) {
            throw new UnauthorizedException("Email or password doesn't match");
        }

        return V1LoginCommandHandler.runHandler(this.commandBus, {
            user: request.user,
            ip: request.ip,
        })
            .then((token) => {
                this.eventBus.publish(
                    new OnLoginEvent(request.user, token, request.ip),
                );

                return {
                    token,
                };
            })
            .catch((error: unknown) => {
                if (
                    error instanceof UserNoEmailMatchException ||
                    error instanceof UserPasswordIncorrectException
                ) {
                    throw new UnauthorizedException(
                        "Email or password doesn't match",
                    );
                }

                throw error;
            });
    }
}
