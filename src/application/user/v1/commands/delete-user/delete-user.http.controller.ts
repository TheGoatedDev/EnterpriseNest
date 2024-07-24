import { BadRequestException, Controller, Delete, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

import { V1DeleteUserResponseDto } from '@/application/user/v1/commands/delete-user/dto/delete-user.response.dto';
import { AllStaffRoles } from '@/domain/user/user-role.enum';
import { ApiOperationWithRoles } from '@/shared/decorator/api-operation-with-roles.decorator';
import { ApiStandardisedResponse } from '@/shared/decorator/api-standardised-response.decorator';
import { GenericInternalValidationException } from '@/shared/exceptions/internal-validation.exception';
import { GenericNotFoundException } from '@/shared/exceptions/not-found.exception';

import { V1FindUserByIDQueryHandler } from '../../queries/find-user-by-id/find-user-by-id.handler';
import { V1FindUserByIDQuery } from '../../queries/find-user-by-id/find-user-by-id.query';
import { V1DeleteUserCommand } from './delete-user.command';
import { V1DeleteUserCommandHandler } from './delete-user.handler';

@ApiTags('User')
@Controller({
    version: '1',
})
export class V1DeleteUserController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    @ApiOperationWithRoles(
        {
            summary: 'Delete a user',
            description:
                'Delete the user with the given ID. This action is irreversible.',
        },
        AllStaffRoles,
    )
    @ApiStandardisedResponse(
        {
            status: 200,
            description: 'The User has been successfully deleted.',
        },
        V1DeleteUserResponseDto,
    )
    @ApiStandardisedResponse(
        {
            status: 404,
            description: 'User not found',
        },
        undefined,
    )
    @Delete('/user/:id')
    async deleteUser(
        @Param('id') id: string,
    ): Promise<V1DeleteUserResponseDto> {
        const foundUser = await V1FindUserByIDQueryHandler.runHandler(
            this.queryBus,
            new V1FindUserByIDQuery(id),
        );

        if (!foundUser) {
            throw new GenericNotFoundException('User not found');
        }

        const deletedUser = await V1DeleteUserCommandHandler.runHandler(
            this.commandBus,
            new V1DeleteUserCommand(foundUser),
        ).catch((error: unknown) => {
            if (error instanceof GenericInternalValidationException) {
                throw new BadRequestException(error);
            }

            throw error;
        });

        return {
            user: deletedUser,
        };
    }
}
