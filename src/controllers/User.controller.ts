import md5 from "md5";
import config from "../config";
import UserSchema from "../database/models/User.schema";
import {
    userControllerI,
    userI,
    userStatusE,
} from "../interfaces/User.interface";
import { customAlphabet } from "nanoid";
import MessageSchema from "../database/models/Message.schema";
import InvestmentSchema from "../database/models/Investment.schema";
import InstallmentSchema from "../database/models/Installment.schema";
import findExcel from "../scripts/excel.script";
import { Readable } from "stream";
import StatementSchema from "../database/models/Statement.schema";
import OperationSchema from "../database/models/Operation.schema";

const userController: userControllerI = {
    getUserInfo: async (req, res) => {
        const secureID = req.body.secure.id;
        const user = await UserSchema.findOne({ secureID });
        if (!user) {
            return res
                .status(404)
                .json({ message: "User does not exist", status: 404 });
        }
        return res
            .status(200)
            .json({ message: "User info", status: 200, data: user });
    },
    getAllMessages: async (req, res) => {
        const secureID = req.body.secure.id;
        const user = await UserSchema.findOne({ secureID }, "id");
        if (!user) {
            return res
                .status(404)
                .json({ message: "User does not exist", status: 404 });
        }
        const id = user.get("id");
        console.log("id :>> ", id);
        const messages = await MessageSchema.find({ sendTo: id });
        return res
            .status(200)
            .json({ message: "All user message", status: 200, data: messages });
    },
    getAllNewMessages: async (req, res) => {
        const secureID = req.body.secure.id;
        const user = await UserSchema.findOne({ secureID }, "id");
        if (!user) {
            return res
                .status(404)
                .json({ message: "User does not exist", status: 404 });
        }
        const id = user.get("id");
        console.log("id :>> ", id);
        const messages = await MessageSchema.find({
            sendTo: id,
            isNewStatus: true,
        });
        const length = messages.length;
        return res.status(200).json({
            message: "All user message",
            status: 200,
            data: { messages, length },
        });
    },
    getOneMessage: async (req, res) => {
        const id = req.params.id;
        const secureID = req.body.secure.id;
        const user = await UserSchema.findOne({ secureID }, "id admin");
        if (!user) {
            return res
                .status(404)
                .json({ message: "User does not exist", status: 404 });
        }
        const userID = user.get("id");
        const message = await MessageSchema.findOne({
            id,
            $or: [{ sendTo: userID }, { sender: secureID }],
        });
        if (!message) {
            return res
                .status(404)
                .json({ message: "Message does not exist", status: 404 });
        }
        if (!user.get("admin")) {
            message.set("isNewStatus", false);
            message.save();
        }
        return res
            .status(200)
            .json({ message: "Message", status: 200, data: message });
    },
    checkToken: (req, res) => {
        return res.status(200).json({ message: "Token OK", status: 200 });
    },
    login: async (req, res) => {
        const { token, id }: { token: string; id: string } = req.body.secure;
        const user = await UserSchema.findOne({ secureID: id }, "status");
        if (!user) {
            return res
                .status(404)
                .json({ message: "User does not exist", status: 404 });
        }
        const status: userStatusE = user.get("status");
        return res.status(200).json({
            message: "Login success",
            status: 200,
            data: { token, status },
        });
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
    getAllInvestments: async (req, res) => {
        const id = req.body.secure.id;
        const investments = await InvestmentSchema.find(
            { userId: id },
            "investorCapital commissionAmount"
        );
        let value = 0;
        let commission = 0;
        if (investments.length > 0) {
            value = investments
                .map((investment) => investment.get("investorCapital"))
                .reduce((prev, next) => prev + next);
            commission = investments
                .map((investment) => investment.get("commissionAmount") || 0)
                .reduce((prev, next) => prev + next);
        }
        return res.status(200).json({
            message: "All investments value",
            status: 200,
            data: { value, commission },
        });
    },
    getActiveInvestments: async (req, res) => {
        const id = req.body.secure.id;
        const investments = await InvestmentSchema.find(
            { userId: id, active: true },
            "investorCapital"
        );

        let value = 0;
        if (investments.length > 0) {
            value = investments
                .map((investment) => investment.get("investorCapital"))
                .reduce((prev, next) => prev + next);
        }
        const length = investments.length;
        return res.status(200).json({
            message: "All investments value",
            status: 200,
            data: { value, length },
        });
    },
    getFinishedInvestments: async (req, res) => {
        const id = req.body.secure.id;
        const investments = await InvestmentSchema.find(
            { userId: id, active: false },
            "investorCapital"
        );
        let value = 0;
        if (investments.length > 0) {
            value = investments
                .map((investment) => investment.get("investorCapital") || 0)
                .reduce((prev, next) => prev + next);
        }
        const length = investments.length;
        return res.status(200).json({
            message: "All investments value",
            status: 200,
            data: { value, length },
        });
    },
    getDelayedInvestments: async (req, res) => {
        const id = req.body.secure.id;
        const now = new Date();
        now.setMonth(now.getMonth());
        const installments = await InstallmentSchema.find(
            {
                userId: id,
                endDate: { $lte: now },
            },
            "initialAmount paidAmount"
        );
        let value = 0;
        const filteredInstallments = installments.filter(
            (installment) =>
                installment.get("initialAmount") -
                    installment.get("paidAmount") >
                0
        );
        if (installments.length > 0) {
            const mappedIntallments = filteredInstallments.map((installment) =>
                installment.get("initialAmount")
            );
            value +=
                mappedIntallments.length > 0
                    ? mappedIntallments.reduce((prev, next) => prev + next)
                    : 0;
        }
        return res.status(200).json({
            message: "All daleyed installments",
            status: 200,
            data: { length: filteredInstallments.length, value },
        });
    },
    getIncomeInvestments: async (req, res) => {
        const id = req.body.secure.id;
        // const date = new Date("2020-01-02");
        const now = new Date();
        // date.setMonth(now.getMonth());
        // date.setFullYear(now.getFullYear());
        // console.log("date :>> ", date);
        const startDate = new Date(now.getFullYear(), now.getMonth(), 2);
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        console.log("endDate :>> ", endDate);
        const installments = await InstallmentSchema.find(
            {
                userId: id,
                startDate: { $lte: endDate, $gte: startDate },
            },
            "initialAmount paidAmount"
        );
        console.log("now :>> ", now);
        const filteredInstallments = installments.filter(
            (installment) =>
                installment.get("initialAmount") -
                    installment.get("paidAmount") >
                0
        );
        let value = 0;
        if (installments.length > 0) {
            const mappedInstallments = filteredInstallments.map((installment) =>
                installment.get("initialAmount")
            );
            value +=
                mappedInstallments.length > 0
                    ? mappedInstallments.reduce((prev, next) => prev + next)
                    : 0;
        }
        return res.status(200).json({
            message: "All daleyed installments",
            status: 200,
            data: { length: installments.length, value },
        });
    },
    editProfile: async (req, res) => {
        console.log("req.headers :>> ", req.headers);
        console.log("req.body :>> ", req.body);
        if (
            !req.body.email ||
            !req.body.name ||
            !req.body.tel ||
            !req.body.adress
        ) {
            return res
                .status(400)
                .json({ message: "Something went wrong", status: 400 });
        }
        const secureID = req.body.secure.id;
        const { email, name, tel, adress } = req.body;
        const user = await UserSchema.findOne({ secureID });
        if (!user) {
            return res
                .status(404)
                .json({ message: "User does not exist", status: 404 });
        }
        user.set("email", email);
        user.set("name", name);
        user.set("tel", tel);
        user.set("adress", adress);
        user.save();
        return res
            .status(200)
            .json({ message: "User profile edited", status: 200 });
    },
    payForInstallments: async (req, res) => {
        const excel = req.file;
        const secureID = req.body.secure.id;
        if (!excel) {
            return res
                .status(404)
                .json({ message: "File not found", status: 404 });
        }
        const fileName = excel.originalname;
        //? Add data to database
        const nanoid = customAlphabet("ABCDEF1234567890", 12);
        const statementId = nanoid();
        const statement = new StatementSchema();
        statement.set("id", statementId);
        statement.set("userId", secureID);
        statement.set("name", fileName);
        statement.save();
        const investments = await InvestmentSchema.find({ userId: secureID });
        for (const investment of investments) {
            const stream = Readable.from(excel.buffer);
            const investmentName = investment.get("name");
            const investmentId = investment.get("id");

            await findExcel(
                stream,
                investmentName,
                secureID,
                investmentId,
                statementId,
                secureID
            );
        }
        res.status(200).json({
            message: "Data successfully send",
            status: 200,
        });
    },
    getTwoStatements: async (req, res) => {
        const secureID = req.body.secure.id;

        const statements = await StatementSchema.find({
            userId: secureID,
        })
            .sort({ createdAt: -1 })
            .limit(2);

        console.log("statements :>> ", statements);
        return res.status(200).json({
            message: "Two users statements",
            status: 200,
            data: statements,
        });
    },
    getAllOperations: async (req, res) => {
        const secureID = req.body.secure.id;
        const operations = await OperationSchema.find({ userId: secureID });
        return res
            .status(200)
            .json({ message: "All operations", status: 200, data: operations });
    },
    getChartData: async (req, res) => {
        const id = req.body.secure.id;
        const dateYear = parseInt(req.params.year) || 0;
        const dateMonth = parseInt(req.params.month) || 0;
        let chartData: {
            month: number;
            initialValue: number;
            paidValue: number;
        }[] = [];
        console.log("dateMonth :>> ", dateMonth);
        for (let i = dateMonth - 3; i <= dateMonth + 1; i++) {
            const startDate = new Date(dateYear, i, 2, 0, 0, 0);
            const endDate = new Date(dateYear, i + 1, 2, 0, 0, 0);
            console.log("startDate :>> ", startDate);
            console.log("endDate :>> ", endDate);
            const installments = await InstallmentSchema.find(
                {
                    userId: id,
                    startDate: { $gte: startDate, $lte: endDate },
                },
                "initialAmount paidAmount startDate"
            );
            console.log("installments :>> ", installments);
            if (installments.length > 0) {
                const initialValue = installments
                    .map((installment) => installment.get("initialAmount"))
                    .reduce((prev, next) => prev + next);
                const paidValue = installments
                    .map((installment) => installment.get("paidAmount"))
                    .reduce((prev, next) => prev + next);
                chartData.push({
                    initialValue,
                    paidValue,
                    month: i < 0 ? 12 + i : i % 12,
                });
            } else {
                chartData.push({
                    initialValue: 0,
                    paidValue: 0,
                    month: i < 0 ? 12 + i : i % 12,
                });
            }
        }

        return res.status(200).json({
            message: "All installments data to chart",
            status: 200,
            data: { chartData },
        });
    },
};

export default userController;
