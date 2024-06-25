import { Module, Type } from '@nestjs/common';

import { V1ValidateUserQueryHandler } from '@/application/modules/authentication/v1/queries/validate-user/validate-user.handler';
import { HashingService } from '@/core/services/hashing/hashing.service';

const QueryHandlers: Type[] = [V1ValidateUserQueryHandler];
const CommandHandlers: Type[] = [];

@Module({
    imports: [],
    controllers: [],
    providers: [...QueryHandlers, ...CommandHandlers, HashingService],
})
export class V1AuthenticationModule {}
