import { Global, Module } from '@nestjs/common';
import { ConditionalModule } from '@nestjs/config';

import { MockRepositoriesModule } from '@/application/system/repositories/mock-repositories.module';
import { RealRepositoriesModule } from '@/application/system/repositories/real-repositories.module';

@Global()
@Module({
    imports: [
        ConditionalModule.registerWhen(
            MockRepositoriesModule,
            (env) => env.NODE_ENV === 'development',
        ),
        ConditionalModule.registerWhen(
            RealRepositoriesModule,
            (env) => env.NODE_ENV === 'production',
        ),
    ],
})
export class RepositoriesModule {}
