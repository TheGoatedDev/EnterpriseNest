import { Global, Module } from '@nestjs/common';

import { MockMailerServiceProvider } from '@/infrastructure/mailer/adapters/mock/mock.mailer.service';

@Global()
@Module({
    providers: [MockMailerServiceProvider],
    exports: [MockMailerServiceProvider],
})
export class MailerModule {}
