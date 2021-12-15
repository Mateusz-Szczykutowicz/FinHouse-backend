interface dbI {
    host: string;
    local: string;
}

interface secureI {
    password_salt;
    token_salt;
}

export interface configI {
    PORT: number;
    db: dbI;
    secure: secureI;
}
