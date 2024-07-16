import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Roles } from '@/application/authentication/decorator/roles.decorator';
import { V1FindAllUsersQueryHandler } from '@/application/user/v1/queries/find-all-users/find-all-users.handler';
import { AllStaffRoles } from '@/domain/user/user-role.enum';
import { ApiStandardisedResponse } from '@/shared/decorator/api-standardised-response.decorator';

import { V1FindAllUsersResponseDto } from './dto/find-all-users.response.dto';

@ApiTags('User')
@Controller({
    version: '1',
})
export class V1FindAllUsersController {
    constructor(private readonly queryBus: QueryBus) {}

    @ApiOperation({
        summary: 'Find all Users',
        description: 'Requires the user to be an read admin.',
    })
    @ApiStandardisedResponse(
        {
            status: 200,
            description: 'The User has been successfully found.',
        },
        V1FindAllUsersResponseDto,
    )
    @ApiStandardisedResponse({
        status: 404,
        description: 'The User could not be found.',
    })
    @Get('/user')
    @Roles(...AllStaffRoles)
    async findAllUsers(): Promise<V1FindAllUsersResponseDto> {
        const users = await V1FindAllUsersQueryHandler.runHandler(
            this.queryBus,
        );

        return { users };
    }
}
