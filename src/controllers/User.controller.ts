import sha256 from "sha256";
import config from "../config";
import UserSchema from "../database/models/User.schema";
import { userControllerI } from "../interfaces/User.interface";

const userController: userControllerI = {
    login: (req, res) => {
        const token = req.body.secure.token;
        return res
            .status(200)
            .json({ message: "Login success", status: 200, token });
    },
    register: async (req, res) => {
        if (!req.body.login || !req.body.password || !req.body.email) {
            return res.status(400).json({
                message: "Login or password or email field is empty",
                status: 400,
            });
        }
        const { login, password, email } = req.body;

        const existUser = await UserSchema.findOne({ login });
        if (existUser) {
            return res.status(409).json({ message: "User exist", status: 409 });
        }

        const passwordWithSalt = sha256(
            `#${password}!${config.secure.password_salt}`
        );
        const user = new UserSchema();
        user.set("login", login);
        user.set("password", passwordWithSalt);
        user.set("email", email);
        const id = sha256(
            `${login}${password}${user.get("_id")}!${Math.random()}`
        );
        user.set("id", id);
        console.log("user :>> ", user);
        user.save();
        return res
            .status(201)
            .json({ message: "Register success", status: 201 });
    },
};

export default userController;
