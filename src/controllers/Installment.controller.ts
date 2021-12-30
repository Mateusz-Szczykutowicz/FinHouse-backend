import sha256 from "sha256";
import InstallmentSchema from "../database/models/Installment.schema";
import InvestmentSchema from "../database/models/Investment.schema";
import { InstallmentControllerI } from "../interfaces/Installment.interface";
import MailScript from "../scripts/Mail.script";
import SMSScript from "../scripts/SMS.script";

const InstallmentController: InstallmentControllerI = {
    createNewInstallment: async (req, res) => {
        if (!req.body.investmentId || !req.body.initialAmount) {
            return res.status(400).json({
                message: "Investment ID or initial amount field is empty",
                status: 400,
            });
        }
        const userId = req.body.secure.id;
        const investmentId = req.body.investmentId;
        const postponement = req.body.postponement * 1 || 0;
        const quantity = req.body.quantity * 1 || 1;
        const initialAmount = req.body.initialAmount * 1;

        if (quantity < 1) {
            return res.status(400).json({
                message: "Numbers of installment have not less than 1",
            });
        }
        if (postponement < 0) {
            return res.status(400).json({
                message: "Numbers of postponement have not less than 0",
            });
        }

        const investment = await InvestmentSchema.findOne({
            id: investmentId,
            userId,
        });

        if (!investment) {
            return res
                .status(404)
                .json({ message: "Investment does not exist", status: 404 });
        }
        for (let i = 0; i < quantity; i++) {
            const installment = new InstallmentSchema();
            const id = sha256(`#${userId}+${investmentId}!${Math.random()}`);
            const startDate = new Date(investment.get("startDate"));
            startDate.setMonth(startDate.getMonth() + i + postponement);
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() - 1);
            endDate.setMonth(endDate.getMonth() + 1);
            installment.set("id", id);
            installment.set("userId", userId);
            installment.set("investmentId", investmentId);
            installment.set("firstName", investment.get("firstName"));
            installment.set("lastName", investment.get("lastName"));
            installment.set("email", investment.get("email"));
            installment.set("tel", investment.get("tel"));
            installment.set("startDate", startDate);
            installment.set("endDate", endDate);
            installment.set("initialAmount", initialAmount);
            installment.save();
        }
        const mailConstent = `
        <p>Dodano nowe raty do konta</p>
        `;
        const smsContent = `
            Dodano nowe raty do konta
        `;
        MailScript.sendMail(
            "Nowe raty na koncie",
            investment.get("email"),
            mailConstent
        );
        SMSScript.sendSMS(investment.get("tel"), smsContent);

        return res
            .status(200)
            .json({ message: "Installment success created", status: 200 });
    },
};

export default InstallmentController;
