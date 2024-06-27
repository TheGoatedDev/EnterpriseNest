export interface SMSOptions {
    from: string;
    to: string;
    text: string;
}

export interface SMSPort<SenderOptions> {
    sendSMS: (sms: SMSOptions, senderOptions: SenderOptions) => Promise<void>;

    sendSMSs: (
        sms: SMSOptions[],
        senderOptions: SenderOptions,
    ) => Promise<void>;
}
