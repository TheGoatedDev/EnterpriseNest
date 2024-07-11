import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
    IsDate,
    IsEmail,
    IsEnum,
    IsOptional,
    IsStrongPassword,
    MinLength,
} from 'class-validator';

import { UserRoleEnum } from './user-role.enum';

export const UserFirstName = () =>
    applyDecorators(
        ApiProperty({
            description: 'User first name',
            example: 'John',
        }),
        IsOptional(),
        MinLength(2),
    );

export class UserFirstNameDto {
    @UserFirstName()
    firstName?: string;
}

export const UserLastName = () =>
    applyDecorators(
        ApiProperty({
            description: 'User last name',
            example: 'Doe',
        }),
        IsOptional(),
        MinLength(2),
    );

export class UserLastNameDto {
    @UserLastName()
    lastName?: string;
}

export const UserEmail = () =>
    applyDecorators(
        ApiProperty({
            description: 'User email',
            example: 'test@email.com',
        }),
        IsEmail(),
    );

export class UserEmailDto {
    @UserEmail()
    email!: string;
}

export const UserPassword = () =>
    applyDecorators(
        ApiProperty({
            example: 'Password123!',
            description:
                'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character and be at least 8 characters long.',
        }),
        IsStrongPassword({
            minLength: 8,
        }),
    );

export class UserPasswordDto {
    @UserPassword()
    password!: string;
}

export const UserRole = () =>
    applyDecorators(
        ApiProperty({
            enum: UserRoleEnum,
            example: UserRoleEnum.USER,
            description: 'User role',
        }),
        IsEnum(UserRoleEnum),
    );

export class UserRoleDto {
    @UserRole()
    role!: UserRoleEnum;
}

export const UserVerifiedAt = () =>
    applyDecorators(
        ApiProperty({
            description: 'User verified at',
            example: new Date(),
        }),
        IsDate(),
        IsOptional(),
    );

export class UserVerifiedAtDto {
    @UserVerifiedAt()
    verifiedAt?: Date;
}
