import mongoose from "mongoose";

const InvestmentSchema = new mongoose.Schema({
    id: { type: String, required: true },
    userId: { type: String, required: true },
    folderId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    tel: { type: String, required: true },
    startDate: { type: Date, default: new Date() },
    endDate: { type: Date, required: true },
    initialAmount: { type: Number, required: true },
    commission: { type: Number, required: true },
    scan: { type: String, default: "" },
});

export default mongoose.model("Investment", InvestmentSchema);
