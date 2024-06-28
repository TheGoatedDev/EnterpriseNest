import { Global, Module } from '@nestjs/common';

import { MockEmailService } from '@/infrastructure/email/mock/mock.email.service';

@Global()
@Module({
    providers: [MockEmailService],
    exports: [MockEmailService],
})
export class EmailModule {}
