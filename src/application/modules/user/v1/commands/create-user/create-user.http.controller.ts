import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { generate as generatePassword } from 'generate-password';

import { Roles } from '@/application/modules/authentication/decorator/roles.decorator';
import { User } from '@/application/modules/user/entity/user.entity';
import { UserRoleEnum } from '@/application/modules/user/entity/user-role.enum';
import { ApiStandardisedResponse } from '@/shared/decorator/api-standardised-response.decorator';

import { V1CreateUserCommand } from './create-user.command';
import { V1CreateUserCommandHandler } from './create-user.handler';
import { V1CreateUserRequestDto } from './dto/create-user.request.dto';
import { V1CreateUserResponseDto } from './dto/create-user.response.dto';

@ApiTags('User')
@Controller({
    version: '1',
})
export class V1CreateUserController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    @Roles(UserRoleEnum.ADMIN, UserRoleEnum.DEVELOPER)
    @Post('/user')
    @ApiOperation({
        summary: 'Creates a User',
        description:
            'Requires the user to be an write admin. Creates a new User with the provided data. The password is randomly generated and returned in the response.',
    })
    @ApiStandardisedResponse(
        {
            status: 201,
            description: 'The User has been successfully created.',
        },
        V1CreateUserResponseDto,
    )
    async createUser(
        @Body() body: V1CreateUserRequestDto,
    ): Promise<V1CreateUserResponseDto> {
        const password = generatePassword({
            length: 10,
            numbers: true,
            symbols: true,
            uppercase: true,
            strict: true,
        });

        const createdUser = await V1CreateUserCommandHandler.runHandler(
            this.commandBus,
            new V1CreateUserCommand(
                User.create({
                    ...body,
                    password,
                }),
            ),
        );

        return {
            user: createdUser,
            password,
        };
    }
}
