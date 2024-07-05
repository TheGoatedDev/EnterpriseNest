import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
    IsDate,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsStrongPassword,
    MinLength,
} from 'class-validator';

import { UserRoleEnum } from './user-role.enum';

export class UserEmailDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        description: 'User email',
        example: 'test@email.com',
    })
    email!: string;
}

export class UserPasswordDto {
    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 8,
    })
    @ApiProperty({
        example: 'Password123!',
        description:
            'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character and be at least 8 characters long.',
    })
    password!: string;
}

export class UserRoleDto {
    @IsNotEmpty()
    @IsEnum(UserRoleEnum)
    @ApiProperty({
        enum: UserRoleEnum,
        example: UserRoleEnum.USER,
        description: 'User role',
    })
    role!: UserRoleEnum;
}

export class UserFirstNameDto {
    @Optional()
    @MinLength(2)
    @ApiProperty({
        description: 'User first name',
        example: 'John',
    })
    firstName!: string | undefined;
}

export class UserLastNameDto {
    @MinLength(2)
    @Optional()
    @ApiProperty({
        description: 'User last name',
        example: 'Doe',
    })
    lastName!: string | undefined;
}

export class UserVerifiedAtDto {
    @Optional()
    @IsDate()
    @ApiProperty({
        description: 'User verified at',
        example: new Date(),
    })
    verifiedAt!: Date | undefined;
}
