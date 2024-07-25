import { Controller, Get, Logger, Request } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

import { ApiOperationWithRoles } from '@/shared/decorator/api-operation-with-roles.decorator';
import { ApiStandardisedResponse } from '@/shared/decorator/api-standardised-response.decorator';
import type { RequestWithUser } from '@/types/express/request-with-user';

import { V1FindCurrentSessionResponseDto } from './dto/find-current-session.response.dto';

@ApiTags('Session')
@Controller({
    version: '1',
})
export class V1FindCurrentSessionController {
    private readonly logger = new Logger(V1FindCurrentSessionController.name);

    constructor(private readonly queryBus: QueryBus) {}

    @ApiOperationWithRoles({
        summary: 'Find Current Session',
    })
    @ApiStandardisedResponse(
        {
            status: 200,
            description: 'The Session has been successfully found.',
        },
        V1FindCurrentSessionResponseDto,
    )
    @Get('/session/me')
    findCurrentSession(
        @Request() req: RequestWithUser,
    ): Promise<V1FindCurrentSessionResponseDto> {
        return Promise.resolve({ session: req.session });
    }
}
