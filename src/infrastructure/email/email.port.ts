export interface EmailOptions {
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

export interface EmailPort {
    sendEmail: (email: EmailOptions) => Promise<void>;

    sendEmails: (emails: EmailOptions[]) => Promise<void>;
}
