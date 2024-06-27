export class OnValidateCredentialsEvent {
    constructor(
        public readonly email: string,
        public readonly emailExists: boolean,
        public readonly passwordMatches: boolean,
    ) {}
}
