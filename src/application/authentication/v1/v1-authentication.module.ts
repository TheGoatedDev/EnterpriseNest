import { Module, Type } from '@nestjs/common';

import { V1ConfirmForgotPasswordCommandHandler } from '@/application/authentication/v1/commands/confirm-forgot-password/confirm-forgot-password.handler';
import { V1ConfirmForgotPasswordController } from '@/application/authentication/v1/commands/confirm-forgot-password/confirm-forgot-password.http.controller';
import { V1ForgotPasswordCommandHandler } from '@/application/authentication/v1/commands/forgot-password/forgot-password.handler';
import { V1ForgotPasswordController } from '@/application/authentication/v1/commands/forgot-password/forgot-password.http.controller';
import { V1LoginCommandHandler } from '@/application/authentication/v1/commands/login/login.handler';
import { V1LoginController } from '@/application/authentication/v1/commands/login/login.http.controller';
import { V1LogoutController } from '@/application/authentication/v1/commands/logout/logout.http.controller';
import { V1RefreshTokenCommandHandler } from '@/application/authentication/v1/commands/refresh/refresh.handler';
import { V1RefreshTokenController } from '@/application/authentication/v1/commands/refresh/refresh.http.controller';
import { V1RegisterCommandHandler } from '@/application/authentication/v1/commands/register/register.handler';
import { V1RegisterController } from '@/application/authentication/v1/commands/register/register.http.controller';
import { V1ValidateCredentialsQueryHandler } from '@/application/authentication/v1/queries/validate-credentials/validate-credentials.handler';
import { HashingService } from '@/shared/services/hashing/hashing.service';

const QueryHandlers: Type[] = [V1ValidateCredentialsQueryHandler];

const CommandHandlers: Type[] = [
    V1LoginCommandHandler,
    V1RegisterCommandHandler,
    V1RefreshTokenCommandHandler,
    V1ForgotPasswordCommandHandler,
    V1ConfirmForgotPasswordCommandHandler,
];
const CommandControllers: Type[] = [
    V1LoginController,
    V1RegisterController,
    V1RefreshTokenController,
    V1LogoutController,
    V1ForgotPasswordController,
    V1ConfirmForgotPasswordController,
];

@Module({
    imports: [],
    controllers: [...CommandControllers],
    providers: [...QueryHandlers, ...CommandHandlers, HashingService],
})
export class V1AuthenticationModule {}
