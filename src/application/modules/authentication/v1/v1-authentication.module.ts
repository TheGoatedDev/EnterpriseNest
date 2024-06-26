import { Module, Type } from '@nestjs/common';

import { V1LoginCommandHandler } from '@/application/modules/authentication/v1/commands/login/login.handler';
import { V1LoginController } from '@/application/modules/authentication/v1/commands/login/login.http.controller';
import { V1ValidateUserQueryHandler } from '@/application/modules/authentication/v1/queries/validate-user/validate-user.handler';
import { HashingService } from '@/core/services/hashing/hashing.service';

const QueryHandlers: Type[] = [V1ValidateUserQueryHandler];
const CommandHandlers: Type[] = [V1LoginCommandHandler];
const CommandControllers: Type[] = [V1LoginController];

@Module({
    imports: [],
    controllers: [...CommandControllers],
    providers: [...QueryHandlers, ...CommandHandlers, HashingService],
})
export class V1AuthenticationModule {}
