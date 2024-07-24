import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

import { AllStaffRoles } from '@/domain/user/user-role.enum';
import { ApiOperationWithRoles } from '@/shared/decorator/api-operation-with-roles.decorator';
import { ApiStandardisedResponse } from '@/shared/decorator/api-standardised-response.decorator';
import { GenericNotFoundException } from '@/shared/exceptions/not-found.exception';

import { V1FindUserByIDResponseDto } from './dto/find-user-by-id.response.dto';
import { V1FindUserByIDQueryHandler } from './find-user-by-id.handler';
import { V1FindUserByIDQuery } from './find-user-by-id.query';

@ApiTags('User')
@Controller({
    version: '1',
})
export class V1FindUserByIDController {
    constructor(private readonly queryBus: QueryBus) {}

    @ApiOperationWithRoles(
        {
            summary: 'Find User by ID',
            description: 'Requires the user to be an read admin.',
        },
        AllStaffRoles,
    )
    @ApiStandardisedResponse(
        {
            status: 200,
            description: 'The User has been successfully found.',
        },
        V1FindUserByIDResponseDto,
    )
    @ApiStandardisedResponse({
        status: 404,
        description: 'The User could not be found.',
    })
    @Get('/user/:id')
    async findUserById(
        @Param('id') id: string,
    ): Promise<V1FindUserByIDResponseDto> {
        const user = await V1FindUserByIDQueryHandler.runHandler(
            this.queryBus,
            new V1FindUserByIDQuery(id),
        );

        if (!user) {
            throw new GenericNotFoundException('User not found');
        }

        return { user };
    }
}
