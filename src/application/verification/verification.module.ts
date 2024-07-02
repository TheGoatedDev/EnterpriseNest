import { Module, Type } from '@nestjs/common';

import { OnVerificationSentAddToCounterHandler } from '@/application/verification/event-handlers/on-verification-sent-add-to-counter.handler';
import { V1VerificationModule } from '@/application/verification/v1/v1.verification.module';

const EventHandlers: Type[] = [OnVerificationSentAddToCounterHandler];

@Module({
    imports: [V1VerificationModule],

    providers: [...EventHandlers],
})
export class VerificationModule {}
