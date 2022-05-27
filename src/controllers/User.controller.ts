import md5 from "md5";
import config from "../config";
import UserSchema from "../database/models/User.schema";
import { userControllerI, userI } from "../interfaces/User.interface";
import { customAlphabet } from "nanoid";

const userController: userControllerI = {
    getUserInfo: async (req, res) => {
        const secureID = req.body.secure.id;
        const user = await UserSchema.findOne({ secureID }, "id name admin");
        if (!user) {
            return res
                .status(404)
                .json({ message: "User does not exist", status: 404 });
        }
        return res
            .status(200)
            .json({ message: "User info", status: 200, data: user });
    },
    checkToken: (req, res) => {
        return res.status(200).json({ message: "Token OK", status: 200 });
    },
    login: (req, res) => {
        const { token }: { token: string; id: string } = req.body.secure;

        return res
            .status(200)
            .json({ message: "Login success", status: 200, data: token });
    },
    register: async (req, res) => {
        if (
            !req.body.email ||
            !req.body.password ||
            !req.body.name ||
            !req.body.tel ||
            !req.body.investmentAmount ||
            !req.body.adress
        ) {
            return res.status(400).json({
                message:
                    "Email or password or name or te or investment amount or adress field is empty",
                status: 400,
            });
        }
        const { email, password, name, tel, investmentAmount, adress } =
            req.body;

        const existUser = await UserSchema.findOne({ email });
        if (existUser) {
            return res.status(409).json({ message: "User exist", status: 409 });
        }

        const passwordWithSalt = md5(
            `#${password}!${config.secure.password_salt}`
        );
        const user = new UserSchema();
        const investmentAmountNumber = parseInt(investmentAmount);
        user.set("password", passwordWithSalt);
        user.set("email", email);
        user.set("name", name);
        user.set("tel", tel);
        user.set(
            "investmentAmount",
            Number.isNaN(investmentAmountNumber) ? 0 : investmentAmountNumber
        );
        user.set("adress", adress);
        const secureID = md5(
            `${name}${password}${user.get("_id")}!${Math.random()}`
        );
        const nanoid = customAlphabet("1234567890ABCDEF", 12);
        const id = nanoid();

        user.set("id", id);
        user.set("secureID", secureID);
        user.save();
        return res
            .status(201)
            .json({ message: "Register success", status: 201 });
    },
};

export default userController;
