import {
    Controller,
    Get,
    Logger,
    NotFoundException,
    Param,
    UnauthorizedException,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '@/application/authentication/decorator/current-user.decorator';
import { User } from '@/domain/user/user.entity';
import { UserRoleEnum } from '@/domain/user/user-role.enum';
import { ApiStandardisedResponse } from '@/shared/decorator/api-standardised-response.decorator';

import { V1FindUserByIDQueryHandler } from '../../../../user/v1/queries/find-user-by-id/find-user-by-id.handler';
import { V1FindUserByIDQuery } from '../../../../user/v1/queries/find-user-by-id/find-user-by-id.query';
import { V1FindAllSessionsByUserResponseDto } from './dto/find-all-sessions-by-user.response.dto';
import { V1FindAllSessionsByUserQueryHandler } from './find-all-sessions-by-user.handler';
import { V1FindAllSessionsByUserQuery } from './find-all-sessions-by-user.query';

@ApiTags('Session')
@Controller({
    version: '1',
})
export class V1FindAllSessionsByUserController {
    private readonly logger = new Logger(
        V1FindAllSessionsByUserController.name,
    );

    constructor(private readonly queryBus: QueryBus) {}

    @ApiOperation({
        summary: 'Find all Sessions By user',
    })
    @ApiStandardisedResponse(
        {
            status: 200,
            description: 'The Sessions has been successfully found.',
        },
        V1FindAllSessionsByUserResponseDto,
    )
    @Get('/session/user/:userid')
    async findSessionByToken(
        @Param('userid') userId: string,
        @CurrentUser() currentUser: User,
    ): Promise<V1FindAllSessionsByUserResponseDto> {
        const foundUser = await V1FindUserByIDQueryHandler.runHandler(
            this.queryBus,
            new V1FindUserByIDQuery(userId),
        ).catch((error: unknown) => {
            throw error;
        });

        if (!foundUser) {
            this.logger.error(`User Not Found`);
            throw new NotFoundException('User Not Found');
        }

        if (
            foundUser.id !== currentUser.id &&
            currentUser.role === UserRoleEnum.USER
        ) {
            this.logger.error('User cannot access other user sessions');
            throw new UnauthorizedException(
                'User cannot access other user sessions',
            );
        }

        const sessions = await V1FindAllSessionsByUserQueryHandler.runHandler(
            this.queryBus,
            new V1FindAllSessionsByUserQuery(foundUser),
        ).catch((error: unknown) => {
            throw error;
        });

        return { sessions };
    }
}
