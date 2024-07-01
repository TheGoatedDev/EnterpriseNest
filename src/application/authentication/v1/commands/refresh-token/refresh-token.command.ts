export class V1RefreshTokenCommand {
    constructor(
        public readonly refreshToken: string,
        public readonly ip?: string,
    ) {}
}
