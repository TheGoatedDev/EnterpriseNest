import { z } from 'zod';

import { UserRoleEnum } from '@/domain/user/user-role.enum';

export interface UserProps {
    firstName?: string;
    lastName?: string;

    email: string;
    password: string;

    verifiedAt?: Date;

    role: UserRoleEnum;
}

export interface CreateUserProps {
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
}

// Must be >= 8 characters, and contain at least one number and one uppercase letter and one special character
export const UserPasswordSchema = z
    .string()
    .min(8)
    .regex(
        // One Number
        /(?=.*\d)/,
        'Password must contain at least one number',
    )
    .regex(
        // One Uppercase Letter
        /(?=.*[A-Z])/,
        'Password must contain at least one uppercase letter',
    )
    .regex(
        // One Special Character
        /(?=.*[!@#$%^&*])/,
        'Password must contain at least one special character (!@#$%^&*)',
    )
    .describe(
        'Password must be at least 8 characters long and contain at least one number, one uppercase letter, and one special character',
    );

export const UserDataSchema = z.object({
    firstName: z.string().min(2).optional(),
    lastName: z.string().min(2).optional(),

    verifiedAt: z.date().optional(),

    email: z.string().email(),
    password: UserPasswordSchema.or(z.string().startsWith('$argon2id$')),
});
