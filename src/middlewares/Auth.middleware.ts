import { NextFunction, Request, Response } from "express";
import sha256 from "sha256";
import config from "../config";
import UserSchema from "../database/models/User.schema";
import { AuthI } from "../interfaces/Auth.interface";

class Auth implements AuthI {
    private static tokens: Map<string | string[], string> = new Map();
    async generateToken(req: Request, res: Response, next: NextFunction) {
        if (!req.body.login || !req.body.password) {
            return res
                .status(400)
                .json({ message: "Body is empty", status: 400 });
        }
        const { login, password } = req.body;
        const passwordWithSalt = sha256(
            `#${password}!${config.secure.password_salt}`
        );
        const user = await UserSchema.findOne(
            { login, password: passwordWithSalt },
            "id"
        );
        if (!user) {
            return res
                .status(406)
                .json({ message: "Login or password is wrong", status: 406 });
        }
        const id = user.get("id");
        const token = sha256(
            `$!${Math.random()}+${id}-!${config.secure.token_salt}`
        );
        Auth.tokens.set(token, id);
        req.body.secure = {};
        req.body.secure.token = token;
        Auth.clearToken(token, 30);
        next();
    }

    public checkToken(req: Request, res: Response, next: NextFunction) {
        if (!req.headers.token) {
            return res
                .status(400)
                .json({ message: "Token does not exist", status: 400 });
        }
        const token = req.headers.token || "";
        if (!Auth.tokens.get(token)) {
            return res
                .status(401)
                .json({ message: "You must be log in", status: 401 });
        }
        req.body.secure = {};
        req.body.secure.id = Auth.tokens.get(token);
        next();
    }

    private static clearToken(token: string, time: number) {
        setTimeout(() => {
            Auth.tokens.delete(token);
        }, time * 1000 * 60);
    }

    public logout(req: Request, res: Response, next: NextFunction) {
        if (!req.headers.token) {
            return res
                .status(400)
                .json({ message: "Token is not exist", status: 400 });
        }
        const token = req.headers.token || "";
        if (!Auth.tokens.get(token)) {
            return res
                .status(406)
                .json({ message: "You no longer log in", status: 406 });
        }
        Auth.tokens.delete(token);
        return res
            .status(200)
            .json({ message: "Success log out", status: 200 });
    }

    public async isAdmin(req: Request, res: Response, next: NextFunction) {
        const id = req.body.secure.id;
        const user = await UserSchema.findOne({ id });
        if (user.get("admin")) {
            next();
        } else {
            return res
                .status(403)
                .json({ message: "You do not have permission", status: 403 });
        }
    }
}

export default new Auth();
