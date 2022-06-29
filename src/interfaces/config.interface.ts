interface dbI {
    host: string;
    local: string;
}

interface secureI {
    password_salt: string;
    token_salt: string;
}

interface nodeMailI {
    host: string;
    port: string;
    login: string;
    password: string;
}

interface SMSI {
    auth: string;
}

export interface configI {
    PORT: number;
    db: dbI;
    secure: secureI;
    nodeMail: nodeMailI;
    SMS: SMSI;
}
