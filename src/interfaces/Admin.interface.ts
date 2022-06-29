import { expressFunction } from "./general.interface";

export interface AdminControllerI {
    getAllUsers: expressFunction;
    sendMessage: expressFunction;
    getAllMessages: expressFunction;
    acceptUser: expressFunction;
    rejectUser: expressFunction;
}
