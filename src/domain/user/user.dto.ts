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
    @ApiProperty({
        description: 'User email',
        example: 'test@email.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email!: string;
}

export class UserPasswordDto {
    @ApiProperty({
        example: 'Password123!',
        description:
            'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character and be at least 8 characters long.',
    })
    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 8,
    })
    password!: string;
}

export class UserRoleDto {
    @ApiProperty({
        enum: UserRoleEnum,
        example: UserRoleEnum.USER,
        description: 'User role',
    })
    @IsEnum(UserRoleEnum)
    @IsNotEmpty()
    role!: UserRoleEnum;
}

export class UserFirstNameDto {
    @ApiProperty({
        description: 'User first name',
        example: 'John',
    })
    @MinLength(2)
    @Optional()
    firstName!: string | undefined;
}

export class UserLastNameDto {
    @ApiProperty({
        description: 'User last name',
        example: 'Doe',
    })
    @MinLength(2)
    @Optional()
    lastName!: string | undefined;
}

export class UserVerifiedAtDto {
    @ApiProperty({
        description: 'User verified at',
        example: new Date(),
    })
    @IsDate()
    @Optional()
    verifiedAt!: Date | undefined;
}
