import mongoose from "mongoose";
import { InvestorI } from "../../interfaces/Investor.interface";

const InvestorSchema = new mongoose.Schema<InvestorI>({
    id: { type: String, required: true },
    userId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    tel: { type: String, required: true },
    commission: { type: Number, required: true },
    contract: { type: String, required: true },
    createdAt: { type: Date, default: new Date() },
});

export default mongoose.model("Investor", InvestorSchema);
