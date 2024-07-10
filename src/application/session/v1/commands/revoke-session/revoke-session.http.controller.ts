import {
    Controller,
    Delete,
    NotFoundException,
    Param,
    UnauthorizedException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '@/application/authentication/decorator/current-user.decorator';
import { User } from '@/domain/user/user.entity';
import { UserRoleEnum } from '@/domain/user/user-role.enum';
import { ApiStandardisedResponse } from '@/shared/decorator/api-standardised-response.decorator';

import { V1FindSessionByTokenQueryHandler } from '../../queries/find-session-by-token/find-session-by-token.handler';
import { V1FindSessionByTokenQuery } from '../../queries/find-session-by-token/find-session-by-token.query';
import { V1RevokeSessionResponseDto } from './dto/revoke-session.response.dto';
import { V1RevokeSessionCommand } from './revoke-session.command';
import { V1RevokeSessionCommandHandler } from './revoke-session.handler';

@ApiTags('Session')
@Controller({
    version: '1',
})
export class V1RevokeSessionController {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
    ) {}

    @ApiOperation({
        summary: 'Revoke Session',
    })
    @ApiStandardisedResponse(
        {
            status: 200,
            description: 'The Session has been successfully Revoked.',
        },
        V1RevokeSessionResponseDto,
    )
    @Delete('/session/:token')
    async revokeSession(
        @Param('token') token: string,
        @CurrentUser() currentUser: User,
    ): Promise<V1RevokeSessionResponseDto> {
        const foundSession = await V1FindSessionByTokenQueryHandler.runHandler(
            this.queryBus,
            new V1FindSessionByTokenQuery(token),
        );

        if (!foundSession) {
            throw new NotFoundException('Session Not Found');
        }

        if (
            currentUser.role === UserRoleEnum.USER &&
            foundSession.userId !== currentUser.id
        ) {
            throw new UnauthorizedException('Unauthorized to Revoke Session');
        }

        const revokedSession = await V1RevokeSessionCommandHandler.runHandler(
            this.commandBus,
            new V1RevokeSessionCommand(foundSession),
        );

        return { session: revokedSession };
    }
}
