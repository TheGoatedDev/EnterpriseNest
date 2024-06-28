import { Module, Type } from '@nestjs/common';

import { V1SendVerificationCommandHandler } from '@/application/verification/v1/commands/send-verification/send-verification.handler';
import { V1SendVerificationController } from '@/application/verification/v1/commands/send-verification/send-verification.http.controller';

const CommandHandlers: Type[] = [V1SendVerificationCommandHandler];
const QueryHandlers: Type[] = [];

const CommandControllers: Type[] = [V1SendVerificationController];
const QueryControllers: Type[] = [];

@Module({
    imports: [],
    controllers: [...CommandControllers, ...QueryControllers],
    providers: [...CommandHandlers, ...QueryHandlers],
})
export class V1VerificationModule {}
