import { expressFunction } from "./general.interface";

export enum userStatusE {
    INPROGRESS = "W trakcie",
    ACCEPTED = "Zaakceptowany",
    REJECTED = "Odrzucony",
}
export interface userControllerI {
    getUserInfo: expressFunction;
    checkToken: expressFunction;
    login: expressFunction;
    register: expressFunction;
    getAllMessages: expressFunction;
    getAllNewMessages: expressFunction;
    getOneMessage: expressFunction;
    getActiveInvestments: expressFunction;
    getAllInvestments: expressFunction;
    getFinishedInvestments: expressFunction;
    getDelayedInvestments: expressFunction;
    getIncomeInvestments: expressFunction;
    editProfile: expressFunction;
    payForInstallments: expressFunction;
    getTwoStatements: expressFunction;
    getAllOperations: expressFunction;
    getChartData: expressFunction;
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
    status: userStatusE;
}
