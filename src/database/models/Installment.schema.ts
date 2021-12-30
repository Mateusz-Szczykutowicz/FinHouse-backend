import mongoose from "mongoose";

const InstallmentSchema = new mongoose.Schema({
    id: { type: String, required: true },
    userId: { type: String, required: true },
    investmentId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    tel: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    initialAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
});

export default mongoose.model("Installment", InstallmentSchema);
