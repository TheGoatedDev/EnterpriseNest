export interface MailerOptions {
    from: string;
    to: string | string[];
    subject: string;
    cc?: string[];
    bcc?: string[];

    text?: string;
    html?: string;

    attachments?: {
        filename: string;
        content: Buffer;
        encoding: 'base64' | 'utf-8' | 'binary' | 'hex' | 'ascii';
        contentType: string;
    }[];
}

export interface MailerPort {
    sendEmail: (email: MailerOptions) => Promise<void>;

    sendEmails: (emails: MailerOptions[]) => Promise<void>;
}
