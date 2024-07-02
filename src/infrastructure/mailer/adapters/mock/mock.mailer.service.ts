import { Injectable, Logger, Provider } from '@nestjs/common';

import { MAILER } from '@/infrastructure/mailer/mailer.constants';
import { MailerOptions, MailerPort } from '@/infrastructure/mailer/mailer.port';

@Injectable()
class MockMailerService implements MailerPort {
    private readonly logger = new Logger(MockMailerService.name);

    sendEmail(email: MailerOptions): Promise<void> {
        const content = email.text ?? email.html ?? '';

        this.logger.log(
            `Sending email to ${JSON.stringify(email.to)} with subject ${email.subject}, body ${content}`,
        );

        return Promise.resolve();
    }

    sendEmails(emails: MailerOptions[]): Promise<void> {
        for (const email of emails) {
            const content = email.text ?? email.html ?? '';

            this.logger.log(
                `Sending email to ${JSON.stringify(email.to)} with subject ${email.subject}, body ${content}`,
            );
        }

        return Promise.resolve();
    }
}

export const MockMailerServiceProvider: Provider = {
    provide: MAILER,
    useClass: MockMailerService,
};
