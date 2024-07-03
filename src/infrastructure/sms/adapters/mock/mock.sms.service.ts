import { Injectable, Logger, Provider } from '@nestjs/common';

import { SMS } from '@/infrastructure/sms/sms.constants';
import { SMSOptions, SMSPort } from '@/infrastructure/sms/sms.port';

@Injectable()
class MockSMS implements SMSPort<undefined> {
    private readonly logger = new Logger(MockSMS.name);

    sendSMS(sms: SMSOptions, _: undefined): Promise<void> {
        this.logger.log(
            `Sending SMS to ${JSON.stringify(sms.to)}, body ${sms.text}`,
        );

        return Promise.resolve();
    }

    sendSMSs(smss: SMSOptions[], _: undefined): Promise<void> {
        for (const sms of smss) {
            this.logger.log(
                `Sending SMS to ${JSON.stringify(sms.to)}, body ${sms.text}`,
            );
        }

        return Promise.resolve();
    }
}

export const MockSMSService: Provider = {
    provide: SMS,
    useClass: MockSMS,
};
