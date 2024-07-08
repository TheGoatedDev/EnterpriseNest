export class V1ConfirmForgotPasswordCommand {
    constructor(
        public readonly resetPasswordToken: string,
        public readonly newPassword: string,
    ) {}
}
