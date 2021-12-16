import { Request, Response } from "express";

type syncFunction = (req: Request, res: Response) => Response;
type asyncFunction = (req: Request, res: Response) => Promise<Response>;

export interface investemntControllerI {
    getAllInvestments: asyncFunction;
    getAllInvestmentsInFolder: asyncFunction;
    getOneInvestment: asyncFunction;
    createNewInwestment: asyncFunction;
}
