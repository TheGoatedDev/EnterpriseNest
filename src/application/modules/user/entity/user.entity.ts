import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { createId } from '@paralleldrive/cuid2';
import { Expose } from 'class-transformer';

import {
    CreateUserProps,
    UserDataSchema,
    UserProps,
} from '@/application/modules/user/entity/user.types';
import {
    AllStaffRoles,
    UserRoleEnum,
} from '@/application/modules/user/entity/user-role.enum';
import { OnUserChangedEmailEvent } from '@/application/modules/user/events/on-user-changed-email.event';
import { OnUserChangedFirstNameEvent } from '@/application/modules/user/events/on-user-changed-first-name.event';
import { OnUserChangedLastNameEvent } from '@/application/modules/user/events/on-user-changed-last-name.event';
import { OnUserChangedPasswordEvent } from '@/application/modules/user/events/on-user-changed-password.event';
import { OnUserChangedRoleEvent } from '@/application/modules/user/events/on-user-changed-role.event';
import { OnUserCreatedEvent } from '@/application/modules/user/events/on-user-created.event';
import { CreateEntityProps, Entity } from '@/core/base/entity/entity.base';
import { GenericInternalValidationException } from '@/core/exceptions/internal-validation.exception';

export const CreateUserMock = (): User =>
    User.create({
        email: faker.internet.email(),
        password: '$argon2id$Password123!',
    });

export class User extends Entity<UserProps> {
    static create(props: CreateUserProps): User {
        const id = createId();

        const data: UserProps = {
            role: UserRoleEnum.USER,
            ...props,
        };

        return new User({ id, data });
    }

    constructor(props: CreateEntityProps<UserProps>) {
        super(props);
        this.apply(new OnUserCreatedEvent(this));
    }

    @Expose()
    @ApiProperty({
        description: 'User first name',
        example: 'John',
        type: String,
        required: false,
    })
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

    @Expose()
    @ApiProperty({
        description: 'User last name',
        example: 'Doe',
        type: String,
        required: false,
    })
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

    @Expose()
    @ApiProperty({
        description: 'User email',
        example: 'test@email.com',
        type: String,
        required: true,
    })
    get email(): string {
        return this.data.email;
    }

    set email(email: string) {
        this.apply(new OnUserChangedEmailEvent(this, this.data.email, email));
        this.data.email = email;
        this.updated();
    }

    @Expose({
        groups: [...AllStaffRoles],
    })
    @ApiProperty({
        description: 'User password',
        type: String,
        required: false,
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

    @Expose()
    @ApiProperty({
        description: 'User role',
        enum: UserRoleEnum,
    })
    get role(): UserRoleEnum {
        return this.data.role;
    }

    set role(role: UserRoleEnum) {
        this.apply(new OnUserChangedRoleEvent(this, this.data.role, role));
        this.data.role = role;
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
