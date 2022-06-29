import md5 from "md5";
import InvestorSchema from "../database/models/Investor.schema";
import InstallmentSchema from "../database/models/Installment.schema";
import InvestmentSchema from "../database/models/Investment.schema";
import {
    investmentControllerI,
    investmentDataI,
    investmentI,
} from "../interfaces/Investment.interface";
import { customAlphabet } from "nanoid";
import { InstallmentStatusE } from "../interfaces/Installment.interface";
import { file } from "../interfaces/general.interface";
import path from "path";
import { getDayDifference } from "../scripts/date.script";

const InvestmentController: investmentControllerI = {
    getAllInvestments: async (req, res) => {
        const userId = req.body.secure.id;
        const investments = await InvestmentSchema.find({ userId });
        return res.status(200).json({
            message: "All investments",
            status: 200,
            data: investments,
        });
    },
    getAllInvestorInvestments: async (req, res) => {
        const investorId = req.params.id;
        const userId = req.body.secure.id;
        const investments = await InvestmentSchema.find({ investorId, userId });

        return res.status(200).json({
            message: "All investor's investments",
            status: 200,
            data: investments,
        });
    },
    getOneInvestment: async (req, res) => {
        const id = req.params.id;
        const investment = await InvestmentSchema.findOne({ id });
        if (!investment) {
            return res
                .status(404)
                .json({ message: "Investment does not exist", status: 404 });
        }
        return res.status(200).json({
            message: "One investment",
            status: 200,
            data: investment,
        });
    },
    getOneInvestmentContract: async (req, res) => {
        const id = req.params.id;
        const investment = await InvestmentSchema.findOne({ id }, "name");
        if (!investment) {
            return res.status(404).json({
                message: "Investor does not exist",
                status: 404,
            });
        }
        const name = investment.get("name");
        const fileName = req.params.file;
        const dir = path.join(
            __dirname,
            `../../uploads/investments/${name}/${fileName}`
        );
        return res.status(200).download(dir);
    },
    createNewInwestment: async (req, res) => {
        const investmentData: investmentDataI = req.body;
        console.log("ivestment :>> ", investmentData);
        if (
            !investmentData.commissionAmount ||
            !investmentData.email ||
            !investmentData.firstInstallment ||
            !investmentData.installmentAmount ||
            !investmentData.investorCapital ||
            !investmentData.investorId ||
            !investmentData.lastInstallment ||
            !investmentData.name ||
            !investmentData.numberOfInstallment ||
            !investmentData.tel
        ) {
            return res.status(400).json({
                message: "One of the fields is empty",
                status: 400,
            });
        }
        if (!req.files) {
            return res
                .status(400)
                .json({ message: "Files are not exist", status: 400 });
        }
        const userId = req.body.secure.id;

        const {
            commissionAmount,
            contract,
            email,
            firstInstallment,
            gracePeriod,
            installmentAmount,
            investorCapital,
            investorId,
            lastInstallment,
            name,
            numberOfInstallment,
            otherCommision,
            tel,
        } = investmentData;
        const startDate = new Date(firstInstallment);
        const endDate = new Date(lastInstallment);

        const investment = new InvestmentSchema();
        const nanoid = customAlphabet("ABCDEF1234567890", 12);
        const id = nanoid();
        investment.set("id", id);
        investment.set("userId", userId);
        investment.set("investorId", investorId);
        investment.set("name", name);
        investment.set("tel", tel);
        investment.set("email", email);
        investment.set("firstInstallment", startDate);
        investment.set("lastInstallment", endDate);
        investment.set(
            "investorCapital",
            Number.isNaN(parseFloat(investorCapital))
                ? 0
                : parseFloat(investorCapital)
        );
        investment.set(
            "commissionAmount",
            Number.isNaN(parseFloat(commissionAmount))
                ? 0
                : parseFloat(commissionAmount)
        );
        investment.set(
            "installmentAmount",
            Number.isNaN(parseFloat(installmentAmount))
                ? 0
                : parseFloat(installmentAmount)
        );
        investment.set(
            "numberOfInstallment",
            Number.isNaN(parseFloat(numberOfInstallment))
                ? 0
                : parseFloat(numberOfInstallment)
        );
        investment.set(
            "gracePeriod",
            Number.isNaN(parseFloat(gracePeriod)) ? 0 : parseFloat(gracePeriod)
        );
        investment.set(
            "otherCommision",
            Number.isNaN(parseFloat(otherCommision))
                ? 0
                : parseFloat(otherCommision)
        );
        const files: file[] = JSON.parse(JSON.stringify(req.files));
        let filename = [];
        for (const file of files) {
            filename.push(`${file.filename}`);
        }
        investment.set("contract", filename.join(", "));

        const investmentId = id;
        const postponement = Number.isNaN(parseFloat(gracePeriod))
            ? 0
            : parseFloat(gracePeriod);
        const quantity = Number.isNaN(parseFloat(numberOfInstallment))
            ? 0
            : parseFloat(numberOfInstallment);
        const initialAmount = Number.isNaN(parseFloat(installmentAmount))
            ? 0
            : parseFloat(installmentAmount);

        if (quantity < 1) {
            return res.status(400).json({
                message: "Numbers of installment have not less than 1",
                status: 400,
            });
        }
        if (postponement < 0) {
            return res.status(400).json({
                message: "Numbers of postponement have not less than 0",
                status: 400,
            });
        }

        if (!investment) {
            return res
                .status(404)
                .json({ message: "Investment does not exist", status: 404 });
        }
        for (let i = 0; i < quantity; i++) {
            const installment = new InstallmentSchema();
            const id = nanoid(12);
            const startDate = new Date(investment.get("firstInstallment"));
            startDate.setMonth(startDate.getMonth() + i + postponement);
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate());
            endDate.setMonth(endDate.getMonth() + 1);
            installment.set("id", id);
            installment.set("userId", userId);
            installment.set("investmentId", investmentId);
            installment.set("startDate", startDate);
            installment.set("endDate", endDate);
            installment.set("initialAmount", initialAmount);
            installment.set("investmentStatus", InstallmentStatusE.TOPAY);
            installment.save();
        }
        investment.save();
        const mailConstent = `
        <p>Dodano nowe raty do konta</p>
        `;
        const smsContent = `
            Dodano nowe raty do konta
        `;
        // Mail.sendMail(
        //     "Nowe raty na koncie",
        //     investment.get("?????email"), //! Do zmiany emial
        //     mailConstent
        // );
        // SMS.sendSMS(investment.get("?????????tel"), smsContent); //! Do zmiany tel

        return res.status(201).json({
            message: "Investment with installments success created",
            status: 201,
        });
    },

    getOverpaymentAndUnderpayments: async (req, res) => {
        const { id } = req.params;
        const now = new Date();
        const investment = await InvestmentSchema.findOne({ id });
        if (!investment) {
            return res
                .status(404)
                .json({ message: "Investment does not exist", status: 404 });
        }
        const installments = await InstallmentSchema.find(
            {
                lastInstallment: {
                    $gte: investment.get("firstInstallment"),
                    $lte: now,
                },
            },
            "paidAmount initialAmount"
        );
        const payment = installments
            .map(
                (installment) =>
                    installment.get("paidAmount") * 1 -
                    installment.get("initialAmount") * 1
            )
            .reduce(
                (paymentPrev, paymentNext) => paymentPrev * 1 + paymentNext * 1
            );

        return res.status(200).json({
            message: "Underpayment and Overpayment",
            status: 200,
            data: payment,
        });
    },
    getPaymentDelay: async (req, res) => {
        const { id } = req.params;
        const now = new Date();
        const investment = await InvestmentSchema.findOne({ id });
        if (!investment) {
            return res
                .status(404)
                .json({ message: "Investment does not exist", status: 404 });
        }
        console.log("investment :>> ", investment);
        const installments = await InstallmentSchema.find(
            {
                investmentId: investment.get("id"),
                lastInstallment: {
                    $gte: investment.get("firstInstallment"),
                    $lte: now,
                },
            },
            "paymentDelay"
        );
        console.log("installments :>> ", installments);
        // const paymentDelay = installments
        //     .map((installment) => installment.get("paymentDelay") * 1)
        //     .reduce(
        //         (paymentDelayPrev, paymentDelayNext) =>
        //             paymentDelayPrev * 1 + paymentDelayNext * 1
        //     );
        const paymentDelay = installments[0].get("paymentDelay") * 1;

        return res.status(200).json({
            message: "Payment daley",
            status: 200,
            data: paymentDelay,
        });
    },
    getAllInstallments: async (req, res) => {
        const now = new Date();
        const userId = req.body.secure.id;
        const investmentId = req.params.id;
        console.log("investmentId :>> ", investmentId);
        const installments =
            (await InstallmentSchema.find({
                userId,
                investmentId,
            }).sort({ startDate: 1 })) || [];
        for (const installment of installments) {
            if (
                installment.get("initialAmount") -
                    installment.get("paidAmount") >
                0
            ) {
                const startDate = new Date(installment.get("startDate"));
                const now = new Date();
                const dayDiff = getDayDifference(now, startDate);
                installment.set("paymentDelay", dayDiff);
                console.log("installment :>> ", installment);
                installment.save();
            } else {
                installment.set("paymentDelay", 0);
                installment.save();
            }
        }
        const filteredInstallments = installments.filter((installment) => {
            const endDate = new Date(installment.get("endDate"));
            return (
                installment.get("initialAmount") -
                    installment.get("paidAmount") >
                    0 && endDate < now
            );
        });
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
        res.status(200).json({
            message: "All investment's installments",
            status: 200,
            data: { installments, value },
        });
    },
    deleteInvestment: async (req, res) => {
        const id = req.params.id;
        const countOfDeletedInstallment = await InstallmentSchema.deleteMany({
            investmentId: id,
        });
        const deletedInvestment = await InvestmentSchema.deleteOne({ id: id });
        return res.status(200).json({
            message: "Delete one investment",
            status: 200,
            data: { countOfDeletedInstallment, deletedInvestment },
        });
    },
    editInvestment: async (req, res) => {
        const userId = req.body.secure.id;
        if (
            !req.body.id ||
            !req.body.name ||
            !req.body.tel ||
            !req.body.email
        ) {
            return res.status(400).json({
                message: "Name or Id or email or tel field is empty",
                status: 400,
            });
        }
        const { id, name, tel, email } = req.body;
        const investment = await InvestmentSchema.findOne({ id, userId });
        if (!investment) {
            return res
                .status(404)
                .json({ message: "Investment does not exist", status: 404 });
        }
        investment.set("name", name);
        investment.set("tel", tel);
        investment.set("email", email);
        investment.save();
        return res
            .status(200)
            .json({ message: "Investment edited success", status: 200 });
    },
};

export default InvestmentController;
