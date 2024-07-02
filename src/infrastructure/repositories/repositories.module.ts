import { Global, Module } from '@nestjs/common';
import { ConditionalModule } from '@nestjs/config';

import { MockRepositoriesModule } from '@/infrastructure/repositories/presets/mock-repositories.module';
import { RealRepositoriesModule } from '@/infrastructure/repositories/presets/real-repositories.module';

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
