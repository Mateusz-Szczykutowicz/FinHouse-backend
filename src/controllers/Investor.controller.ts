import InvestorSchema from "../database/models/Investor.schema";
import InstallmentSchema from "../database/models/Installment.schema";
import InvestmentSchema from "../database/models/Investment.schema";
import {
    InvestorControllerI,
    InvestorI,
} from "../interfaces/Investor.interface";
import UserSchema from "../database/models/User.schema";
import { customAlphabet } from "nanoid";
import { investmentI } from "../interfaces/Investment.interface";

const InvestorController: InvestorControllerI = {
    getAllUserInvestors: async (req, res) => {
        console.log("req.body.secure.id :>> ", req.body.secure.id);
        const secureID = req.body.secure.id;
        const investors = await InvestorSchema.find({ userId: secureID });
        console.log("investors :>> ", investors);
        let response = [];
        for (const investor of investors) {
            const investments = await InvestmentSchema.find({
                investorId: investor.get("id"),
                userId: secureID,
            });

            if (investments.length === 0) {
                response.push({
                    investor,
                    invest: {
                        investedAmount: 0,
                        installmentsAmount: 0,
                        commissionsAmount: 0,
                    },
                });
                continue;
            }
            const investedAmount: number =
                investments
                    .map((investment) => investment.get("investorCapital"))
                    .reduce((prev, next) => prev + next) || 0;
            const installmentsAmount: number =
                investments
                    .map((investment) => investment.get("installmentAmount"))
                    .reduce((prev, next) => prev + next) || 0;
            const commissionsAmount: number =
                investments
                    .map((investment) => investment.get("commissionAmount"))
                    .reduce((prev, next) => prev + next) || 0;
            const invest = {
                investedAmount,
                installmentsAmount,
                commissionsAmount,
            };
            response.push({ investor, invest });
        }

        return res.status(200).json({
            message: "Your all investors",
            status: 200,
            data: response,
        });
    },
    getOneUserInvestor: async (req, res) => {
        const id = req.params.id;
        const userId = req.body.secure.id;
        const investor = await InvestorSchema.findOne({ id, userId });
        if (!investor) {
            return res
                .status(404)
                .json({ message: "Investor does not exist", status: 404 });
        }
        //! dodać inwestycje <- wszystkie dla investora
        return res
            .status(200)
            .json({ message: "Investor", status: 200, data: investor });
    },
    createNewInvestor: async (req, res) => {
        console.log("req.headers :>> ", req.headers);
        if (
            !req.body.name ||
            !req.body.tel ||
            !req.body.email ||
            !req.body.commission
        ) {
            return res.status(400).json({
                message:
                    "First name or last name or tel or email field is empty",
                status: 400,
            });
        }
        const secureID = req.body.secure.id;
        const { name, tel, email, commission } = req.body;
        const commissionNumber = Number.isNaN(parseInt(commission))
            ? 0
            : parseInt(commission);
        const investor = new InvestorSchema();
        const nanoid = customAlphabet("1234567890ABCDEF", 12);
        const id = nanoid();
        investor.set("id", id);
        investor.set("userId", secureID);
        investor.set("name", name);
        investor.set("email", email);
        investor.set("tel", tel);
        investor.set("commission", commissionNumber);
        investor.set("contract", "contract");
        investor.save();
        return res
            .status(201)
            .json({ message: "Investor created", status: 201 });
    },
    editInvestor: async (req, res) => {
        if (!req.body.id) {
            return res.status(400).json({
                message: "Wrong data! Check fields - id, name, email, tel",
                status: 400,
            });
        }
        const userId = req.body.secure.id;
        const { id, name, email, tel } = req.body;
        const investor = await InvestorSchema.findOne({ id, userId });
        if (!investor) {
            return res
                .status(404)
                .json({ message: "Investor does not exist", status: 404 });
        }
        const investments = await InvestmentSchema.find({
            investorId: id,
            userId,
        });

        if (!(name === "" || !name)) {
            investor.set("name", name);
        }
        if (!(email === "" || !email)) {
            investor.set("email", email);
        }
        if (!(tel === "" || !tel)) {
            investor.set("tel", tel);
        }
        for (const investment of investments) {
            const installments = await InstallmentSchema.find({
                investmentId: investment.get("id"),
            });
            if (!(name === "" || !name)) {
                investment.set("investorName", name);
            }
            if (!(email === "" || !email)) {
                investment.set("investorEmail", email);
            }
            if (!(tel === "" || !tel)) {
                investment.set("investorTel", tel);
            }
            for (const installment of installments) {
                if (!(name === "" || !name)) {
                    installment.set("investorName", name);
                }
                if (!(email === "" || !email)) {
                    installment.set("investorEmail", email);
                }
                if (!(tel === "" || !tel)) {
                    installment.set("investorTel", tel);
                }
                installment.save();
            }
            investment.save();
        }
        investor.save();
        return res
            .status(200)
            .json({ message: "Investor updated", status: 200 });
    },
};

export default InvestorController;
