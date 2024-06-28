import { Module, Type } from '@nestjs/common';

import { V1LoginCommandHandler } from '@/application/authentication/v1/commands/login/login.handler';
import { V1LoginController } from '@/application/authentication/v1/commands/login/login.http.controller';
import { V1RegisterCommandHandler } from '@/application/authentication/v1/commands/register/register.handler';
import { V1RegisterController } from '@/application/authentication/v1/commands/register/register.http.controller';
import { V1ValidateCredentialsQueryHandler } from '@/application/authentication/v1/queries/validate-credentials/validate-credentials.handler';
import { HashingService } from '@/shared/services/hashing/hashing.service';

const QueryHandlers: Type[] = [V1ValidateCredentialsQueryHandler];
const CommandHandlers: Type[] = [
    V1LoginCommandHandler,
    V1RegisterCommandHandler,
];
const CommandControllers: Type[] = [V1LoginController, V1RegisterController];

@Module({
    imports: [],
    controllers: [...CommandControllers],
    providers: [...QueryHandlers, ...CommandHandlers, HashingService],
})
export class V1AuthenticationModule {}
