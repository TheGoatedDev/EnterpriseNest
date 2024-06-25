import type { ClassProvider } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';

import { MockUserRepository } from '@/core/entities/user/repository/mock-user.repository';
import { USER_REPOSITORY } from '@/core/entities/user/user.constants';
import { HashingService } from '@/core/services/hashing/hashing.service';

export const MOCK_REPOSITORIES: ClassProvider[] = [
    {
        provide: USER_REPOSITORY,
        useClass: MockUserRepository,
    },
];

@Global()
@Module({
    providers: [...MOCK_REPOSITORIES, HashingService],
    exports: MOCK_REPOSITORIES.map((provider) => provider.provide),
})
export class MockRepositoriesModule {}
