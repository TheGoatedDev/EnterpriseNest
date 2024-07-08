import { z } from 'zod';

const StringToNumber = z.preprocess((x) => Number(x), z.number());
const StringToNumberOptional = z.preprocess(
    (x) => Number(x),
    z.number().optional(),
);
const StringToBoolean = z.preprocess((x) => x === 'true', z.boolean());

export const ConfigSchema = z.object({
    // Main
    NODE_ENV: z
        .enum(['development', 'test', 'production'])
        .default('development'),
    PORT: StringToNumber.default(3000),
    APP_NAME: z.string().default('EnterpriseNest'),
    BEHIND_PROXY: StringToBoolean.default('false'),
    DEBUG: StringToBoolean.default('false'),

    // Redis
    REDIS_HOST: z.string().default('localhost'),
    REDIS_PORT: StringToNumber.default(6379),
    REDIS_DB: StringToNumber.default(0),
    REDIS_USERNAME: z.string().default(''),
    REDIS_PASSWORD: z.string().default(''),

    // Cache
    CACHE_TTL_MS: StringToNumber.default(60000),
    CACHE_USE_REDIS: StringToBoolean.default('false'),

    // Throttler / Rate Limiter
    THROTTLER_DEFAULT_TTL_MS: StringToNumber.default(60000),
    THROTTLER_DEFAULT_LIMIT: StringToNumber.default(100),
    THROTTLER_USE_REDIS: StringToBoolean.default('false'),

    // Authentication
    AUTH_IP_STRICT: StringToBoolean.default('false'),
    AUTH_AUTO_VERIFY: StringToBoolean.default('false'),

    // JWT
    JWT_SECRET: z.string(),

    // Token
    TOKEN_ACCESS_SECRET: z.string(),
    TOKEN_REFRESH_SECRET: z.string(),
    TOKEN_VERIFICATION_SECRET: z.string(),
    TOKEN_RESET_PASSWORD_SECRET: z.string(),

    TOKEN_ACCESS_TOKEN_EXPIRATION: StringToNumberOptional.optional(),
    TOKEN_REFRESH_TOKEN_EXPIRATION: StringToNumberOptional.optional(),
    TOKEN_VERIFICATION_TOKEN_EXPIRATION: StringToNumberOptional.optional(),
    TOKEN_RESET_PASSWORD_TOKEN_EXPIRATION: StringToNumberOptional.optional(),

    // Email
    EMAIL_FROM: z.string().email().default('no-reply@test.com'),
});

export type Config = z.infer<typeof ConfigSchema>;
