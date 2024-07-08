import {
    BadRequestException,
    Body,
    Controller,
    Param,
    Put,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Roles } from '@/application/authentication/decorator/roles.decorator';
import { V1UpdateUserResponseDto } from '@/application/user/v1/commands/update-user/dto/update-user.response.dto';
import { AllStaffRoles } from '@/domain/user/user-role.enum';
import { ApiStandardisedResponse } from '@/shared/decorator/api-standardised-response.decorator';
import { GenericInternalValidationException } from '@/shared/exceptions/internal-validation.exception';
import { GenericNotFoundException } from '@/shared/exceptions/not-found.exception';

import { V1FindUserByIDQueryHandler } from '../../queries/find-user-by-id/find-user-by-id.handler';
import { V1FindUserByIDQuery } from '../../queries/find-user-by-id/find-user-by-id.query';
import { V1UpdateUserRequestDto } from './dto/update-user.request.dto';
import { V1UpdateUserCommand } from './update-user.command';
import { V1UpdateUserCommandHandler } from './update-user.handler';

@ApiTags('User')
@Controller({
    version: '1',
})
export class V1UpdateUserController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    @ApiOperation({
        summary: 'Updates the  for a user',
        description:
            'Updates the  for a user, but if you are a "USER" role you can only edit your own user id',
    })
    @ApiStandardisedResponse(
        {
            status: 200,
            description: 'The  has been successfully updated.',
        },
        V1UpdateUserResponseDto,
    )
    @ApiStandardisedResponse({
        status: 401,
        description: 'You can only update your own email.',
    })
    @ApiStandardisedResponse(
        {
            status: 404,
            description: 'User not found',
        },
        undefined,
    )
    @Put('/user/:id')
    @Roles(...AllStaffRoles)
    async updateUser(
        @Param('id') id: string,
        @Body() body: V1UpdateUserRequestDto,
    ): Promise<V1UpdateUserResponseDto> {
        const foundUser = await V1FindUserByIDQueryHandler.runHandler(
            this.queryBus,
            new V1FindUserByIDQuery(id),
        );

        if (!foundUser) {
            throw new GenericNotFoundException('User not found');
        }

        foundUser.email = body.email ?? foundUser.email;
        foundUser.password = body.password ?? foundUser.password;
        foundUser.firstName = body.firstName ?? foundUser.firstName;
        foundUser.lastName = body.lastName ?? foundUser.lastName;
        foundUser.role = body.role ?? foundUser.role;

        const updated = await V1UpdateUserCommandHandler.runHandler(
            this.commandBus,
            new V1UpdateUserCommand(foundUser),
        ).catch((error: unknown) => {
            if (error instanceof GenericInternalValidationException) {
                throw new BadRequestException(error);
            }

            throw error;
        });

        return {
            user: updated,
        };
    }
}
