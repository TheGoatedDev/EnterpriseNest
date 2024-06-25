import { Module, Type } from '@nestjs/common';

import { V1FindUserByEmailQueryHandler } from '@/application/modules/user/v1/queries/find-user-by-email/find-user-by-email.handler';

const QueryHandlers: Type[] = [V1FindUserByEmailQueryHandler];
const CommandHandlers: Type[] = [];

@Module({
    imports: [],
    controllers: [],
    providers: [...QueryHandlers, ...CommandHandlers],
})
export class V1UserModule {}
