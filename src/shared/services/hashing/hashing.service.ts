import crypto from 'node:crypto';

import { Injectable } from '@nestjs/common';
import { argon2id, argon2Verify } from 'hash-wasm';

@Injectable()
export class HashingService {
    generateSalt(): string {
        // Generate a random 32-byte Uint8Array and convert it to a 64-character hexadecimal string.
        return crypto
            .getRandomValues(new Uint8Array(128))
            .reduce((memo, i) => memo + i.toString(16).padStart(2, '0'), '');
    }

    async hash(password: string): Promise<string> {
        return argon2id({
            password,
            salt: this.generateSalt(),
            iterations: 64,
            memorySize: 1024,
            parallelism: 4,
            hashLength: 256,
            outputType: 'encoded',
        });
    }

    async compare(plain: string, hashed: string): Promise<boolean> {
        return argon2Verify({
            password: plain,
            hash: hashed,
        });
    }
}
