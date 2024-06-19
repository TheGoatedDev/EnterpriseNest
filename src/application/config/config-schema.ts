import { z } from 'zod';

export const ConfigSchema = z.object({
    // Main
    NODE_ENV: z
        .enum(['development', 'test', 'production'])
        .default('development'),
    PORT: z.number().default(3000),
    APP_NAME: z.string().default('EnterpriseNest'),

    // Redis
    REDIS_HOST: z.string().default('localhost'),
    REDIS_PORT: z.number().default(6379),
    REDIS_DB: z.number().default(0),
    REDIS_USERNAME: z.string().default(''),
    REDIS_PASSWORD: z.string().default(''),

    // Cache
    CACHE_TTL_MS: z.number().default(60000),
    CACHE_USE_REDIS: z.enum(['true', 'false']).default('false'),
});

export type Config = z.infer<typeof ConfigSchema>;
