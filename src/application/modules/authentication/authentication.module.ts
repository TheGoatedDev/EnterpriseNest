import { Module, Type } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { OnValidateCredentialsWhenPasswordIncorrectAddToCounterHandler } from '@/application/modules/authentication/event-handlers/on-validate-credentials-when-password-incorrect-add-to-counter.handler';
import { AccessTokenStrategy } from '@/application/modules/authentication/strategies/access-token/access-token.strategy';
import { LocalStrategy } from '@/application/modules/authentication/strategies/local/local.strategy';
import { RefreshTokenStrategy } from '@/application/modules/authentication/strategies/refresh-token/refresh-token.strategy';
import { V1AuthenticationModule } from '@/application/modules/authentication/v1/v1-authentication.module';

const EventHandlers: Type[] = [
    OnValidateCredentialsWhenPasswordIncorrectAddToCounterHandler,
];

@Module({
    imports: [PassportModule, V1AuthenticationModule],

    providers: [
        ...EventHandlers,
        LocalStrategy,
        AccessTokenStrategy,
        RefreshTokenStrategy,
    ],
})
export class AuthenticationModule {}
