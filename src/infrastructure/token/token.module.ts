import { Module } from '@nestjs/common';

import { JwtModule } from '@/infrastructure/jwt/jwt.module';
import { V1TokenModule } from '@/infrastructure/token/v1/v1-token.module';

@Module({
    imports: [V1TokenModule, JwtModule],
    exports: [],
})
export class TokenModule {}
