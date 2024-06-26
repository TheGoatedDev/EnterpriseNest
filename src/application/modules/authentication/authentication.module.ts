import { Module, Type } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { LocalStrategy } from '@/application/modules/authentication/strategies/local/local.strategy';
import { V1AuthenticationModule } from '@/application/modules/authentication/v1/v1-authentication.module';

const EventHandlers: Type[] = [];

@Module({
    imports: [PassportModule, V1AuthenticationModule],

    providers: [...EventHandlers, LocalStrategy],
})
export class AuthenticationModule {}
