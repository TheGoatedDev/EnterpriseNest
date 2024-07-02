import { Module, Type } from '@nestjs/common';

import { V1ConfirmVerificationCommandHandler } from '@/application/verification/v1/commands/confirm-verification/confirm-verification.handler';
import { V1ConfirmVerificationController } from '@/application/verification/v1/commands/confirm-verification/confirm-verification.http.controller';
import { V1SendVerificationCommandHandler } from '@/application/verification/v1/commands/send-verification/send-verification.handler';
import { V1SendVerificationController } from '@/application/verification/v1/commands/send-verification/send-verification.http.controller';

const CommandHandlers: Type[] = [
    V1SendVerificationCommandHandler,
    V1ConfirmVerificationCommandHandler,
];
const QueryHandlers: Type[] = [];

const CommandControllers: Type[] = [
    V1SendVerificationController,
    V1ConfirmVerificationController,
];
const QueryControllers: Type[] = [];

@Module({
    imports: [],
    controllers: [...CommandControllers, ...QueryControllers],
    providers: [...CommandHandlers, ...QueryHandlers],
})
export class V1VerificationModule {}
