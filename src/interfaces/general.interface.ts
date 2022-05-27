import { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";
import { InvestorI } from "./Investor.interface";
import { userI } from "./User.interface";

type responseI = {
    message: string;
    status: number;
    data?: any;
};

export type expressFunction = (
    req: Request,
    res: Response<responseI>,
    NextFunction: NextFunction
) => void;
