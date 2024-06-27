import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { HashingService } from './hashing.service';

describe('hashingService', () => {
    let service: HashingService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [HashingService],
        }).compile();

        service = module.get<HashingService>(HashingService);
    });

    it('should generate a salt of correct length', () => {
        const salt = service.generateSalt();
        expect(salt).toHaveLength(256); // A 32-byte Uint8Array will generate a 64-character hexadecimal string.
    });

    it('should hash password correctly', async () => {
        const password = 'testpassword';
        const hash = await service.hash(password);
        expect(hash).not.toEqual(password);
    });

    it('should compare password correctly', async () => {
        const password = 'testpassword';
        const hash = await service.hash(password);
        const isCorrect = await service.compare(password, hash);
        expect(isCorrect).toBe(true);

        const isIncorrect = await service.compare('wrongpassword', hash);
        expect(isIncorrect).toBe(false);
    });
});
