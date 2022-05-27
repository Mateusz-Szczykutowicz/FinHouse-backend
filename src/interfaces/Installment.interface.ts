import { Request, Response } from "express";

type syncFunction = (req: Request, res: Response) => Response;
type asyncFunction = (req: Request, res: Response) => Promise<Response>;

export interface InstallmentControllerI {}

export enum InstallmentStatusE {
    TOPAY = "Do zaplaty",
    PAID = "Zaplacony",
    LATE = "Spozniony",
}
export interface InstallmentI {
    id: string;
    userId: string;
    investmentId: string;
    installmentStatus: InstallmentStatusE;
    startDate: Date;
    endDate: Date;
    initialAmount: number;
    paidAmount: number;
    paymentDelay: number;
}
