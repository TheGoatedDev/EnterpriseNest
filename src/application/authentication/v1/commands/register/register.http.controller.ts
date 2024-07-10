import { Body, Controller, Post, Req } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { Public } from '@/application/authentication/decorator/public.decorator';
import { V1RegisterCommandHandler } from '@/application/authentication/v1/commands/register/register.handler';
import { User } from '@/domain/user/user.entity';
import { ApiStandardisedResponse } from '@/shared/decorator/api-standardised-response.decorator';
import type { RequestWithUser } from '@/types/express/request-with-user';

import { V1RegisterRequestDto } from './dto/register.request.dto';
import { V1RegisterResponseDto } from './dto/register.response.dto';

@ApiTags('Authentication')
@Controller({
    version: '1',
})
export class V1RegisterController {
    constructor(private readonly commandBus: CommandBus) {}

    @ApiOperation({
        summary: 'Register to a User',
    })
    // Throttle the register endpoint to prevent brute force attacks (10 Requests per minute)
    @ApiStandardisedResponse(
        {
            status: 201,
            description: 'User Was Registered Successfully',
        },
        V1RegisterResponseDto,
    )
    @ApiStandardisedResponse({
        status: 409,
        description: 'User Already Exists',
    })
    @ApiStandardisedResponse({
        status: 400,
        description: 'Validation Error',
    })
    @Post('/authentication/register')
    @Public()
    @Throttle({
        default: {
            limit: 10,
            ttl: 60 * 1000,
        },
    })
    async register(
        @Req() request: RequestWithUser,
        @Body() body: V1RegisterRequestDto,
    ): Promise<V1RegisterResponseDto> {
        const user = User.create({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            password: body.password,
        });

        return V1RegisterCommandHandler.runHandler(this.commandBus, {
            user,
            ip: request.ip,
        });
    }
}
