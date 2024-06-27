import { Module, Type } from '@nestjs/common';

import { V1CreateUserCommandHandler } from '@/application/user/v1/commands/create-user/create-user.handler';
import { V1CreateUserController } from '@/application/user/v1/commands/create-user/create-user.http.controller';
import { V1UpdateUserCommandHandler } from '@/application/user/v1/commands/update-user/update-user.handler';
import { V1UpdateUserController } from '@/application/user/v1/commands/update-user/update-user.http.controller';
import { V1FindUserByEmailQueryHandler } from '@/application/user/v1/queries/find-user-by-email/find-user-by-email.handler';
import { V1FindUserByIDQueryHandler } from '@/application/user/v1/queries/find-user-by-id/find-user-by-id.handler';
import { V1FindUserByIDController } from '@/application/user/v1/queries/find-user-by-id/find-user-by-id.http.controller';

const QueryHandlers: Type[] = [
    V1FindUserByEmailQueryHandler,
    V1FindUserByIDQueryHandler,
];
const QueryControllers: Type[] = [V1FindUserByIDController];

const CommandHandlers: Type[] = [
    V1CreateUserCommandHandler,
    V1UpdateUserCommandHandler,
];
const CommandControllers: Type[] = [
    V1CreateUserController,
    V1UpdateUserController,
];

@Module({
    imports: [],
    controllers: [...CommandControllers, ...QueryControllers],
    providers: [...QueryHandlers, ...CommandHandlers],
})
export class V1UserModule {}
