import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    Matches,
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
    @MinLength(8)
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]+$/,
        {
            message:
                'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
        },
    )
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
