import { NextFunction, Request, Response } from "express";

type middlewareFunction = (
    req: Request,
    res: Response,
    next: NextFunction
) => void;

export interface AuthI {
    generateToken: middlewareFunction;
    checkToken: middlewareFunction;
    logout: middlewareFunction;
}
