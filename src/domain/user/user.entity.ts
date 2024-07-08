import { ApiProperty } from '@nestjs/swagger';
import { createId } from '@paralleldrive/cuid2';
import { Expose } from 'class-transformer';

import { Entity } from '@/domain/base/entity/entity.base';
import { OnUserChangedEmailEvent } from '@/domain/user/events/on-user-changed-email.event';
import { OnUserChangedFirstNameEvent } from '@/domain/user/events/on-user-changed-first-name.event';
import { OnUserChangedLastNameEvent } from '@/domain/user/events/on-user-changed-last-name.event';
import { OnUserChangedPasswordEvent } from '@/domain/user/events/on-user-changed-password.event';
import { OnUserChangedRoleEvent } from '@/domain/user/events/on-user-changed-role.event';
import { OnUserChangedVerifiedAtEvent } from '@/domain/user/events/on-user-changed-verified-at.event';
import {
    CreateUserProps,
    UserDataSchema,
    UserProps,
} from '@/domain/user/user.types';
import { AllStaffRoles, UserRoleEnum } from '@/domain/user/user-role.enum';
import { GenericInternalValidationException } from '@/shared/exceptions/internal-validation.exception';

export class User extends Entity<UserProps> {
    static create(props: CreateUserProps): User {
        const id = createId();

        const data: UserProps = {
            role: UserRoleEnum.USER,
            verifiedAt: undefined,
            ...props,
        };

        return new User({ id, data });
    }

    @ApiProperty({
        description: 'User first name',
        example: 'John',
        type: String,
        required: false,
    })
    @Expose()
    get firstName(): string | undefined {
        return this.data.firstName;
    }

    set firstName(firstName: string | undefined) {
        this.apply(
            new OnUserChangedFirstNameEvent(
                this,
                this.data.firstName,
                firstName,
            ),
        );
        this.data.firstName = firstName;
        this.updated();
    }

    @ApiProperty({
        description: 'User last name',
        example: 'Doe',
        type: String,
        required: false,
    })
    @Expose()
    get lastName(): string | undefined {
        return this.data.lastName;
    }

    set lastName(lastName: string | undefined) {
        this.apply(
            new OnUserChangedLastNameEvent(this, this.data.lastName, lastName),
        );
        this.data.lastName = lastName;
        this.updated();
    }

    @ApiProperty({
        description: 'User email',
        example: 'test@email.com',
        type: String,
        required: true,
    })
    @Expose()
    get email(): string {
        return this.data.email;
    }

    set email(email: string) {
        this.apply(new OnUserChangedEmailEvent(this, this.data.email, email));
        this.data.email = email;
        this.updated();
    }

    @ApiProperty({
        description: 'User password',
        type: String,
        required: false,
    })
    @Expose({
        groups: [...AllStaffRoles],
    })
    get password(): string {
        return this.data.password;
    }

    set password(password: string) {
        this.data.password = password;

        // This is a workaround to avoid the password being hashed twice
        if (!this.isPasswordHashed) {
            this.apply(new OnUserChangedPasswordEvent(this));
        }
        this.updated();
    }

    @ApiProperty({
        description: 'User role',
        enum: UserRoleEnum,
    })
    @Expose()
    get role(): UserRoleEnum {
        return this.data.role;
    }

    set role(role: UserRoleEnum) {
        this.apply(new OnUserChangedRoleEvent(this, this.data.role, role));
        this.data.role = role;
        this.updated();
    }

    @ApiProperty({
        description: 'User Verified At',
        type: Date,
        required: false,
    })
    @Expose()
    get verifiedAt(): Date | undefined {
        return this.data.verifiedAt;
    }

    set verifiedAt(verifiedAt: Date | undefined) {
        this.apply(
            new OnUserChangedVerifiedAtEvent(
                this,
                this.data.verifiedAt,
                verifiedAt,
            ),
        );
        this.data.verifiedAt = verifiedAt;
        this.updated();
    }

    public makeAdmin(): void {
        this.role = UserRoleEnum.ADMIN;
    }

    public makeUser(): void {
        this.role = UserRoleEnum.USER;
    }

    get isPasswordHashed(): boolean {
        return this.password.startsWith('$argon2id$');
    }

    validate(): void {
        try {
            UserDataSchema.parse(this.data);
        } catch (error) {
            if (error instanceof Error) {
                throw new GenericInternalValidationException(error);
            }
            throw new GenericInternalValidationException();
        }
    }
}
