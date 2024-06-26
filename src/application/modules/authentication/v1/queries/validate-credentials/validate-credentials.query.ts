export class V1ValidateCredentialsQuery {
    constructor(
        public readonly email: string,
        public readonly password: string,
    ) {}
}
