import { Injectable, Logger, Provider } from '@nestjs/common';

import { EMAIL } from '@/infrastructure/email/email.constants';
import { EmailOptions, EmailPort } from '@/infrastructure/email/email.port';

@Injectable()
class MockEmail implements EmailPort {
    private readonly logger = new Logger(MockEmail.name);

    sendEmail(email: EmailOptions): Promise<void> {
        const content = email.text ?? email.html ?? '';

        this.logger.log(
            `Sending email to ${JSON.stringify(email.to)} with subject ${email.subject}, body ${content}`,
        );

        return Promise.resolve();
    }

    sendEmails(emails: EmailOptions[]): Promise<void> {
        for (const email of emails) {
            const content = email.text ?? email.html ?? '';

            this.logger.log(
                `Sending email to ${JSON.stringify(email.to)} with subject ${email.subject}, body ${content}`,
            );
        }

        return Promise.resolve();
    }
}

export const MockEmailService: Provider = {
    provide: EMAIL,
    useClass: MockEmail,
};
