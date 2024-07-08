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
import { AllStaffRoles } from '@/domain/user/user-role.enum';
import { ApiStandardisedResponse } from '@/shared/decorator/api-standardised-response.decorator';

import { V1FindSessionByTokenResponseDto } from './dto/find-session-by-token.response.dto';
import { V1FindSessionByTokenQueryHandler } from './find-session-by-token.handler';
import { V1FindSessionByTokenQuery } from './find-session-by-token.query';

@ApiTags('Session')
@Controller({
    version: '1',
})
export class V1FindSessionByTokenController {
    private readonly logger = new Logger(V1FindSessionByTokenController.name);

    constructor(private readonly queryBus: QueryBus) {}

    @ApiOperation({
        summary: 'Find Session By Token',
    })
    @ApiStandardisedResponse(
        {
            status: 200,
            description: 'The Session has been successfully found.',
        },
        V1FindSessionByTokenResponseDto,
    )
    @Get('/session/:token')
    async findSessionByToken(
        @Param('token') token: string,
        @CurrentUser() currentUser: User,
    ): Promise<V1FindSessionByTokenResponseDto> {
        const session = await V1FindSessionByTokenQueryHandler.runHandler(
            this.queryBus,
            new V1FindSessionByTokenQuery(token),
        ).catch((error: unknown) => {
            throw error;
        });

        if (!session) {
            this.logger.error(`Session Not Found`);
            throw new NotFoundException('Session Not Found');
        }

        if (
            !AllStaffRoles.includes(currentUser.role) &&
            currentUser.id !== session.userId
        ) {
            this.logger.error(
                `Session is not owned by this User ${currentUser.id}`,
            );
            throw new UnauthorizedException(
                'Session is not owned by this User',
            );
        }

        this.logger.log(`Session found: ${session.token}`);

        return { session };
    }
}
