import mongoose from "mongoose";
import { investmentI } from "../../interfaces/Investment.interface";

const InvestmentSchema = new mongoose.Schema<investmentI>({
    id: { type: String, required: true },
    userId: { type: String, required: true },
    investorId: { type: String, required: true },
    // investorName: { type: String, required: true },
    // investorEmail: { type: String, required: true },
    // investorTel: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    tel: { type: String, required: true },
    firstInstallment: { type: Date, required: true },
    lastInstallment: { type: Date, required: true },
    investorCapital: { type: Number, required: true },
    commissionAmount: { type: Number, required: true },
    installmentAmount: { type: Number, required: true },
    numberOfInstallment: { type: Number, required: true },
    gracePeriod: { type: Number, default: 0 },
    otherCommision: { type: Number, default: 0 },
    contract: { type: String, default: "" },
});

export default mongoose.model("Investment", InvestmentSchema);
