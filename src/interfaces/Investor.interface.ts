import { expressFunction } from "./general.interface";

export enum investorStatusE {
    INPROGRESS = "W trakcie",
    ACCEPTED = "Zaakceptowany",
    REJECTED = "Odrzucony",
}

export type investorStatusT = investorStatusE;

export interface InvestorControllerI {
    getAllUserInvestors: expressFunction;
    getOneUserInvestor: expressFunction;
    createNewInvestor: expressFunction;
    editInvestor: expressFunction;
}

export interface InvestorI {
    id: string;
    userId: string;
    name: string;
    email: string;
    tel: string;
    commission: number;
    contract: string;
    createdAt: Date;
}
