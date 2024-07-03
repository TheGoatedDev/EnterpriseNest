import { Module } from '@nestjs/common';
import { JwtModule as BaseJwtModule } from '@nestjs/jwt';

import { ConfigModule } from '@/infrastructure/config/config.module';
import { JwtConfigService } from '@/infrastructure/config/configs/jwt-config.service';

@Module({
    imports: [
        BaseJwtModule.registerAsync({
            global: true,
            imports: [ConfigModule],
            inject: [JwtConfigService],
            useFactory: (configService: JwtConfigService) => ({
                secret: configService.secret,
                algorithms: ['HS512'],
            }),
        }),
    ],
    exports: [],
})
export class JwtModule {}
