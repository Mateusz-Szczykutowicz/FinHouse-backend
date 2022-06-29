import { customAlphabet } from "nanoid";
import MessageSchema from "../database/models/Message.schema";
import UserSchema from "../database/models/User.schema";
import { AdminControllerI } from "../interfaces/Admin.interface";
import { userStatusE } from "../interfaces/User.interface";

const AdminController: AdminControllerI = {
    getAllUsers: async (req, res) => {
        const users = await UserSchema.find({ admin: false });
        console.log("users :>> ", users);
        res.status(200).json({
            message: "All admin users",
            status: 200,
            data: users,
        });
    },
    getAllMessages: async (req, res) => {
        const secureID = req.body.secure.id;
        const messages = await MessageSchema.find({ sender: secureID });
        return res.status(200).json({
            message: "All user messages send",
            status: 200,
            data: messages,
        });
    },
    sendMessage: async (req, res) => {
        console.log("req.body :>> ", req.body);
        if (
            !req.body.title ||
            !req.body.subtitle ||
            !req.body.content ||
            !req.body.sendTo
        ) {
            return res.status(400).json({
                message: "One of fields is empty",
                status: 400,
            });
        }
        const secureID = req.body.secure.id;
        const { title, subtitle, content, sendTo } = req.body;

        const recipients = sendTo.split(", ");
        const user = await UserSchema.findOne({ secureID }, "name");
        console.log("user :>> ", user);
        if (!user) {
            return res
                .status(404)
                .json({ message: "User does not exist", status: 404 });
        }
        const author = user.get("name");
        for (const recipient of recipients) {
            const nanoid = customAlphabet("ABCDEF1234567890", 12);
            const id = nanoid();
            const message = new MessageSchema();
            message.set("id", id);
            message.set("sender", secureID);
            message.set("sendTo", recipient);
            message.set("title", title);
            message.set("subtitle", subtitle);
            message.set("content", content);
            message.set("author", author);
            message.save();
        }
        return res.status(201).json({
            message: "Message successfully send",
            status: 201,
        });
    },
    acceptUser: async (req, res) => {
        if (!req.body.user) {
            return res
                .status(400)
                .json({ message: "User does not exist", status: 400 });
        }
        const id = req.body.user;
        const resposne = await UserSchema.updateOne(
            { id },
            { status: userStatusE.ACCEPTED }
        );
        return res
            .status(200)
            .json({ message: "User successfully accepted", status: 200 });
    },
    rejectUser: async (req, res) => {
        if (!req.body.user) {
            return res
                .status(400)
                .json({ message: "User does not exist", status: 400 });
        }
        const id = req.body.user;
        const resposne = await UserSchema.updateOne(
            { id },
            { status: userStatusE.REJECTED }
        );
        return res.status(200).json({
            message: "User successfully rejected",
            status: 200,
        });
    },
};

export default AdminController;
