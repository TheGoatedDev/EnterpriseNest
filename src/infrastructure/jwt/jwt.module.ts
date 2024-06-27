import { Module } from '@nestjs/common';
import { JwtModule as BaseJwtModule } from '@nestjs/jwt';

import { ConfigModule } from '@/infrastructure/config/config.module';
import { AuthenticationConfigService } from '@/infrastructure/config/configs/authentication-config.service';

@Module({
    imports: [
        BaseJwtModule.registerAsync({
            global: true,
            imports: [ConfigModule],
            inject: [AuthenticationConfigService],
            useFactory: (configService: AuthenticationConfigService) => ({
                secret: configService.jwtSecret,
                signOptions: { expiresIn: configService.accessTokenExpiration },
            }),
        }),
    ],
    exports: [],
})
export class JwtModule {}
