import { Module } from '@nestjs/common';
import { JwtModule as BaseJwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        BaseJwtModule.register({
            global: true,
        }),
    ],
    exports: [],
})
export class JwtModule {}
