import { SMSAPI, MessageResponse } from "smsapi";
import config from "../config";
import { SMSScriptI } from "../interfaces/SMS.interface";

class SMS implements SMSScriptI {
    public sendSMS = (number: string, content: string) => {
        const smsapi = new SMSAPI(config.SMS.auth);
        const response = async (): Promise<MessageResponse> => {
            return await smsapi.sms.sendSms(`+48${number}`, `${content}`);
        };
        response();
    };
}

export default new SMS();
