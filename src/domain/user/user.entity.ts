import { IntersectionType } from '@nestjs/swagger';
import { createId } from '@paralleldrive/cuid2';
import { Expose, plainToInstance } from 'class-transformer';

import { Entity } from '@/domain/base/entity/entity.base';
import { OnUserChangedEmailEvent } from '@/domain/user/events/on-user-changed-email.event';
import { OnUserChangedFirstNameEvent } from '@/domain/user/events/on-user-changed-first-name.event';
import { OnUserChangedLastNameEvent } from '@/domain/user/events/on-user-changed-last-name.event';
import { OnUserChangedPasswordEvent } from '@/domain/user/events/on-user-changed-password.event';
import { OnUserChangedRoleEvent } from '@/domain/user/events/on-user-changed-role.event';
import { OnUserChangedVerifiedAtEvent } from '@/domain/user/events/on-user-changed-verified-at.event';
import {
    UserEmail,
    UserEmailDto,
    UserFirstName,
    UserFirstNameDto,
    UserLastName,
    UserLastNameDto,
    UserPassword,
    UserPasswordDto,
    UserRole,
    UserRoleDto,
    UserVerifiedAt,
    UserVerifiedAtDto,
} from '@/domain/user/user.dto';
import { AllStaffRoles, UserRoleEnum } from '@/domain/user/user-role.enum';

export class UserData extends IntersectionType(
    UserFirstNameDto,
    UserLastNameDto,
    UserEmailDto,
    UserPasswordDto,
    UserVerifiedAtDto,
    UserRoleDto,
) {}

export interface CreateUserProps {
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
}

export class User extends Entity<UserData> {
    static create(props: CreateUserProps): User {
        const id = createId();

        const data: UserData = plainToInstance(UserData, {
            role: UserRoleEnum.USER,
            verifiedAt: undefined,
            ...props,
        });

        return new User({ id, data });
    }

    @Expose()
    @UserFirstName()
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
    @UserLastName()
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
    @UserEmail()
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
    @UserPassword()
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
    @UserRole()
    get role(): UserRoleEnum {
        return this.data.role;
    }

    set role(role: UserRoleEnum) {
        this.apply(new OnUserChangedRoleEvent(this, this.data.role, role));
        this.data.role = role;
        this.updated();
    }

    @Expose()
    @UserVerifiedAt()
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
}
