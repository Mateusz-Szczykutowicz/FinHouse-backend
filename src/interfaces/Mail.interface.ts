type sendMailFunc = (subject: string, email: string, content: string) => void;

export interface MailScriptI {
    sendMail: sendMailFunc;
}
