import { expressFunction } from "./general.interface";

export interface userControllerI {
    getUserInfo: expressFunction;
    checkToken: expressFunction;
    login: expressFunction;
    register: expressFunction;
}

export interface userI {
    id: string;
    secureID: string;
    email: string;
    password: string;
    name: string;
    tel: string;
    investmentAmount: number;
    adress: string;
    admin: boolean;
    createdAt: Date;
}
