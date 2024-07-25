import { Controller, Get, Logger } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '@/application/authentication/decorator/current-user.decorator';
import { V1FindAllSessionsByUserQueryHandler } from '@/application/session/v1/queries/find-all-sessions-by-user/find-all-sessions-by-user.handler';
import { User } from '@/domain/user/user.entity';
import { ApiOperationWithRoles } from '@/shared/decorator/api-operation-with-roles.decorator';
import { ApiStandardisedResponse } from '@/shared/decorator/api-standardised-response.decorator';

import { V1FindAllSessionsByCurrentUserResponseDto } from './dto/find-all-sessions-by-current-user.response.dto';

@ApiTags('Session')
@Controller({
    version: '1',
})
export class V1FindAllSessionsByCurrentUserController {
    private readonly logger = new Logger(
        V1FindAllSessionsByCurrentUserController.name,
    );

    constructor(private readonly queryBus: QueryBus) {}

    @ApiOperationWithRoles({
        summary: 'Find all Sessions By current user',
    })
    @ApiStandardisedResponse(
        {
            status: 200,
            description: 'The Sessions has been successfully found.',
        },
        V1FindAllSessionsByCurrentUserResponseDto,
    )
    @Get('/session/user/me')
    async findSessionByCurrentUser(
        @CurrentUser() currentUser: User,
    ): Promise<V1FindAllSessionsByCurrentUserResponseDto> {
        const sessions = await V1FindAllSessionsByUserQueryHandler.runHandler(
            this.queryBus,
            {
                user: currentUser,
            },
        );

        return { sessions };
    }
}
