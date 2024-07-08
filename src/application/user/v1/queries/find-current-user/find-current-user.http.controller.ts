import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '@/application/authentication/decorator/current-user.decorator';
import { Roles } from '@/application/authentication/decorator/roles.decorator';
import { User } from '@/domain/user/user.entity';
import { UserRoleEnum } from '@/domain/user/user-role.enum';
import { ApiStandardisedResponse } from '@/shared/decorator/api-standardised-response.decorator';

import { V1FindCurrentUserResponseDto } from './dto/find-current-user.response.dto';

@ApiTags('User')
@Controller({
    version: '1',
})
export class V1FindCurrentUserController {
    constructor(private readonly queryBus: QueryBus) {}

    @ApiOperation({
        summary: 'Find Current',
    })
    @ApiStandardisedResponse(
        {
            status: 200,
            description: 'The User has been successfully found.',
        },
        V1FindCurrentUserResponseDto,
    )
    @Get('/user/me')
    @Roles(UserRoleEnum.USER)
    findCurrentUser(
        @CurrentUser() user: User,
    ): Promise<V1FindCurrentUserResponseDto> {
        return Promise.resolve({ user });
    }
}
