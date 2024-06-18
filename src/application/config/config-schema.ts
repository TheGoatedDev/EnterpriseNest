import { z } from 'zod';

export const ConfigSchema = z.object({
    NODE_ENV: z
        .enum(['development', 'test', 'production'])
        .default('development'),

    PORT: z.number().default(3000),
});

export type Config = z.infer<typeof ConfigSchema>;
