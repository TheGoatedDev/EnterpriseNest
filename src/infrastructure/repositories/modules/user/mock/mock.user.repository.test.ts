import { CreateMockUser } from '@tests/utils/create-mocks';

import { User } from '@/domain/user/user.entity';
import { HashingService } from '@/shared/services/hashing/hashing.service';

import { MockUserRepository } from './mock.user.repository';

describe('mockUserRepository', () => {
    let mockUserRepository: MockUserRepository;
    let hashingService: HashingService;
    let testUser: User;

    beforeEach(async () => {
        hashingService = new HashingService();
        mockUserRepository = new MockUserRepository(hashingService);

        testUser = CreateMockUser();

        await mockUserRepository.create(testUser);
    });

    test('should find a User by email', async () => {
        expect(await mockUserRepository.findOneByEmail(testUser.email)).toEqual(
            testUser,
        );
    });

    test('should return undefined if find user by email doesnt exist', async () => {
        expect(
            await mockUserRepository.findOneByEmail('idont@exist.com'),
        ).toEqual(undefined);
    });
});
