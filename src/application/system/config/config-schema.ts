import { z } from 'zod';

const StringToNumber = z.preprocess((x) => Number(x), z.number());

export const ConfigSchema = z.object({
    // Main
    NODE_ENV: z
        .enum(['development', 'test', 'production'])
        .default('development'),
    PORT: StringToNumber.default(3000),
    APP_NAME: z.string().default('EnterpriseNest'),
    BEHIND_PROXY: z.enum(['true', 'false']).default('false'),

    // Redis
    REDIS_HOST: z.string().default('localhost'),
    REDIS_PORT: StringToNumber.default(6379),
    REDIS_DB: StringToNumber.default(0),
    REDIS_USERNAME: z.string().default(''),
    REDIS_PASSWORD: z.string().default(''),

    // Cache
    CACHE_TTL_MS: StringToNumber.default(60000),
    CACHE_USE_REDIS: z.enum(['true', 'false']).default('false'),

    // Throttler / Rate Limiter
    THROTTLER_DEFAULT_TTL_MS: StringToNumber.default(60000),
    THROTTLER_DEFAULT_LIMIT: StringToNumber.default(100),
    THROTTLER_USE_REDIS: z.enum(['true', 'false']).default('false'),

    // Authentication
    AUTH_JWT_SECRET: z.string(),
    AUTH_ACCESS_TOKEN_EXPIRATION: z.string().default('1h'),
    AUTH_REFRESH_TOKEN_EXPIRATION: z.string().default('7d'),
});

export type Config = z.infer<typeof ConfigSchema>;
