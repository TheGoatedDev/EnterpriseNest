import { type ClassProvider, Global, Module } from '@nestjs/common';

import { MockSessionRepositoryProvider } from '@/infrastructure/repositories/modules/session/mock/mock.session.repository';
import { MockUserRepositoryProvider } from '@/infrastructure/repositories/modules/user/mock/mock.user.repository';
import { HashingService } from '@/shared/services/hashing/hashing.service';

export const REPOSITORIES: ClassProvider[] = [
    MockUserRepositoryProvider,
    MockSessionRepositoryProvider,
];

@Global()
@Module({
    providers: [...REPOSITORIES, HashingService],
    exports: REPOSITORIES.map((provider) => provider),
})
export class RealRepositoriesModule {}
