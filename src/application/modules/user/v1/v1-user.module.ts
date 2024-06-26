import { Module, Type } from '@nestjs/common';

import { V1CreateUserCommandHandler } from '@/application/modules/user/v1/commands/create-user/create-user.handler';
import { V1CreateUserController } from '@/application/modules/user/v1/commands/create-user/create-user.http.controller';
import { V1FindUserByEmailQueryHandler } from '@/application/modules/user/v1/queries/find-user-by-email/find-user-by-email.handler';

const QueryHandlers: Type[] = [V1FindUserByEmailQueryHandler];

const CommandHandlers: Type[] = [V1CreateUserCommandHandler];
const CommandControllers: Type[] = [V1CreateUserController];

@Module({
    imports: [],
    controllers: [...CommandControllers],
    providers: [...QueryHandlers, ...CommandHandlers],
})
export class V1UserModule {}
