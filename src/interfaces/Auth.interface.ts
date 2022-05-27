import { expressFunction } from "./general.interface";

export interface AuthI {
    generateToken: expressFunction;
    checkToken: expressFunction;
    logout: expressFunction;
}
