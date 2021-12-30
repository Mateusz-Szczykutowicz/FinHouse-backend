type sendSMSFunc = (number: string, content: string) => void;

export interface SMSScriptI {
    sendSMS: sendSMSFunc;
}
