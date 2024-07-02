import type { ClassProvider } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';

import { MockSessionRepositoryProvider } from '@/infrastructure/repositories/modules/session/mock/mock.session.repository';
import { MockUserRepositoryProvider } from '@/infrastructure/repositories/modules/user/mock/mock.user.repository';
import { HashingService } from '@/shared/services/hashing/hashing.service';

export const MOCK_REPOSITORIES: ClassProvider[] = [
    MockUserRepositoryProvider,
    MockSessionRepositoryProvider,
];

@Global()
@Module({
    providers: [...MOCK_REPOSITORIES, HashingService],
    exports: MOCK_REPOSITORIES.map((provider) => provider),
})
export class MockRepositoriesModule {}
