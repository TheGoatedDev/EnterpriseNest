import { Module, Type } from '@nestjs/common';

import { V1CreateSessionCommandHandler } from '@/application/session/v1/commands/create-session/create-session.handler';
import { V1RevokeSessionCommandHandler } from '@/application/session/v1/commands/revoke-session/revoke-session.handler';
import { V1RevokeSessionController } from '@/application/session/v1/commands/revoke-session/revoke-session.http.controller';
import { V1FindAllSessionsByUserQueryHandler } from '@/application/session/v1/queries/find-all-sessions-by-user/find-all-sessions-by-user.handler';
import { V1FindAllSessionsByUserController } from '@/application/session/v1/queries/find-all-sessions-by-user/find-all-sessions-by-user.http.controller';
import { V1FindSessionByTokenQueryHandler } from '@/application/session/v1/queries/find-session-by-token/find-session-by-token.handler';
import { V1FindSessionByTokenController } from '@/application/session/v1/queries/find-session-by-token/find-session-by-token.http.controller';

const commandHandlers: Type[] = [
    V1CreateSessionCommandHandler,
    V1RevokeSessionCommandHandler,
];

const commandControllers: Type[] = [V1RevokeSessionController];

const queryHandlers: Type[] = [
    V1FindSessionByTokenQueryHandler,
    V1FindAllSessionsByUserQueryHandler,
];

const queryControllers: Type[] = [
    V1FindAllSessionsByUserController,
    V1FindSessionByTokenController,
];

@Module({
    controllers: [...queryControllers, ...commandControllers],
    providers: [...commandHandlers, ...queryHandlers],
})
export class V1SessionModule {}
