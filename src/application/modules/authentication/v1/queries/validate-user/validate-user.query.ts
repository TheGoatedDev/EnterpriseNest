export class V1ValidateUserQuery {
    constructor(
        public readonly email: string,
        public readonly password: string,
    ) {}
}
