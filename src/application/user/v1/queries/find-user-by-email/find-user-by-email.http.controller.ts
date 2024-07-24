import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

import { V1FindUserByEmailParamDto } from '@/application/user/v1/queries/find-user-by-email/dto/find-user-by-email.param.dto';
import { V1FindUserByEmailQueryHandler } from '@/application/user/v1/queries/find-user-by-email/find-user-by-email.handler';
import { AllStaffRoles } from '@/domain/user/user-role.enum';
import { ApiOperationWithRoles } from '@/shared/decorator/api-operation-with-roles.decorator';
import { ApiStandardisedResponse } from '@/shared/decorator/api-standardised-response.decorator';
import { GenericNotFoundException } from '@/shared/exceptions/not-found.exception';

import { V1FindUserByEmailResponseDto } from './dto/find-user-by-email.response.dto';

@ApiTags('User')
@Controller({
    version: '1',
})
export class V1FindUserByEmailController {
    constructor(private readonly queryBus: QueryBus) {}

    @ApiOperationWithRoles(
        {
            summary: 'Find User by Email',
            description: 'Requires the user to be an read admin.',
        },
        AllStaffRoles,
    )
    @ApiStandardisedResponse(
        {
            status: 200,
            description: 'The User has been successfully found.',
        },
        V1FindUserByEmailResponseDto,
    )
    @ApiStandardisedResponse({
        status: 404,
        description: 'The User could not be found.',
    })
    @Get('/user/email/:email')
    async findUserById(
        @Param() params: V1FindUserByEmailParamDto,
    ): Promise<V1FindUserByEmailResponseDto> {
        const user = await V1FindUserByEmailQueryHandler.runHandler(
            this.queryBus,
            {
                email: params.email,
            },
        );

        if (!user) {
            throw new GenericNotFoundException('User not found');
        }

        return { user };
    }
}
