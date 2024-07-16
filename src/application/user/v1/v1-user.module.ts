import { Module, Type } from '@nestjs/common';

import { V1CreateUserCommandHandler } from '@/application/user/v1/commands/create-user/create-user.handler';
import { V1CreateUserController } from '@/application/user/v1/commands/create-user/create-user.http.controller';
import { V1DeleteUserCommandHandler } from '@/application/user/v1/commands/delete-user/delete-user.handler';
import { V1DeleteUserController } from '@/application/user/v1/commands/delete-user/delete-user.http.controller';
import { V1UpdateUserCommandHandler } from '@/application/user/v1/commands/update-user/update-user.handler';
import { V1UpdateUserController } from '@/application/user/v1/commands/update-user/update-user.http.controller';
import { V1FindAllUsersQueryHandler } from '@/application/user/v1/queries/find-all-users/find-all-users.handler';
import { V1FindAllUsersController } from '@/application/user/v1/queries/find-all-users/find-all-users.http.controller';
import { V1FindCurrentUserController } from '@/application/user/v1/queries/find-current-user/find-current-user.http.controller';
import { V1FindUserByEmailQueryHandler } from '@/application/user/v1/queries/find-user-by-email/find-user-by-email.handler';
import { V1FindUserByEmailController } from '@/application/user/v1/queries/find-user-by-email/find-user-by-email.http.controller';
import { V1FindUserByIDQueryHandler } from '@/application/user/v1/queries/find-user-by-id/find-user-by-id.handler';
import { V1FindUserByIDController } from '@/application/user/v1/queries/find-user-by-id/find-user-by-id.http.controller';

const QueryHandlers: Type[] = [
    V1FindUserByEmailQueryHandler,
    V1FindUserByIDQueryHandler,
    V1FindAllUsersQueryHandler,
];
const QueryControllers: Type[] = [
    V1FindUserByEmailController,
    V1FindCurrentUserController,
    V1FindUserByIDController,
    V1FindAllUsersController,
];

const CommandHandlers: Type[] = [
    V1CreateUserCommandHandler,
    V1UpdateUserCommandHandler,
    V1DeleteUserCommandHandler,
];
const CommandControllers: Type[] = [
    V1CreateUserController,
    V1UpdateUserController,
    V1DeleteUserController,
];

@Module({
    imports: [],
    controllers: [...CommandControllers, ...QueryControllers],
    providers: [...QueryHandlers, ...CommandHandlers],
})
export class V1UserModule {}
