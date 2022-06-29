import { Request, Response } from "express";
import { expressFunction } from "./general.interface";

export interface investmentControllerI {
    getAllInvestments: expressFunction;
    getAllInvestorInvestments: expressFunction;
    getOneInvestment: expressFunction;
    getAllInstallments: expressFunction;
    createNewInwestment: expressFunction;
    getOverpaymentAndUnderpayments: expressFunction;
    getPaymentDelay: expressFunction;
    getOneInvestmentContract: expressFunction;
    editInvestment: expressFunction;
    deleteInvestment: expressFunction;
}

export interface investmentDataI {
    investorId: string;
    name: string;
    email: string;
    tel: string;
    firstInstallment: Date;
    lastInstallment: Date;
    investorCapital: string;
    commissionAmount: string;
    installmentAmount: string;
    numberOfInstallment: string;
    gracePeriod: string;
    otherCommision: string;
    contract: string;
    active: boolean;
}

export interface investmentI {
    id: string;
    userId: string;
    investorId: string;
    name: string;
    email: string;
    tel: string;
    firstInstallment: Date;
    lastInstallment: Date;
    investorCapital: number;
    commissionAmount: number;
    installmentAmount: number;
    numberOfInstallment: number;
    gracePeriod: number;
    otherCommision: number;
    contract: string;
    active: boolean;
}
