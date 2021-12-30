import config from "../config";
import { MailScriptI } from "../interfaces/Mail.interface";
const nodemailer = require("nodemailer");

class Mail implements MailScriptI {
    private mail = nodemailer.createTransport({
        host: config.nodeMail.host,
        port: config.nodeMail.port,
        secure: false, // upgrade later with STARTTLS
        auth: {
            user: config.nodeMail.login,
            pass: config.nodeMail.password,
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
        },
    });

    sendMail = (subject: string, email: string, content: string) => {
        const message = {
            from: "DeltaStorm <noreply@deltastorm.pl>",
            to: `${email}`,
            subject: `${subject}`,
            html: `
        <html>
        <body>
        ${content}
        </body>
        </html>
        `,
        };
        this.mail.sendMail(message, (error: any) => {
            if (error) {
                return console.log(error);
            }
            return true;
        });
    };
}

export default new Mail();
