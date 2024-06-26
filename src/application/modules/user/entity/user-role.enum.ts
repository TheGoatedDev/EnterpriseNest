export enum UserRoleEnum {
    USER = 'USER',
    ADMIN = 'ADMIN',
    DEVELOPER = 'DEVELOPER',
}

export const AllStaffRoles = [UserRoleEnum.ADMIN, UserRoleEnum.DEVELOPER];

export const ReadWriteStaffRoles = [UserRoleEnum.ADMIN, UserRoleEnum.DEVELOPER];
