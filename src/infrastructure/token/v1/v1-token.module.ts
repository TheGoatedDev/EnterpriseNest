import { Module, Type } from '@nestjs/common';

import { V1GenerateAccessTokenCommandHandler } from '@/infrastructure/token/v1/commands/generate-access-token/generate-access-token.handler';
import { V1GenerateRefreshTokenCommandHandler } from '@/infrastructure/token/v1/commands/generate-refresh-token/generate-refresh-token.handler';
import { V1GenerateResetPasswordTokenCommandHandler } from '@/infrastructure/token/v1/commands/generate-reset-password-token/generate-reset-password-token.handler';
import { V1GenerateVerificationTokenCommandHandler } from '@/infrastructure/token/v1/commands/generate-verification-token/generate-verification-token.handler';

const QueryHandlers: Type[] = [];
const QueryControllers: Type[] = [];

const CommandHandlers: Type[] = [
    V1GenerateAccessTokenCommandHandler,
    V1GenerateRefreshTokenCommandHandler,
    V1GenerateVerificationTokenCommandHandler,
    V1GenerateResetPasswordTokenCommandHandler,
];
const CommandControllers: Type[] = [];

@Module({
    imports: [],
    controllers: [...CommandControllers, ...QueryControllers],
    providers: [...QueryHandlers, ...CommandHandlers],
})
export class V1TokenModule {}
