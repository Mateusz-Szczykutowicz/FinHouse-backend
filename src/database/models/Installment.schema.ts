import mongoose from "mongoose";
import {
    InstallmentI,
    InstallmentStatusE,
} from "../../interfaces/Installment.interface";

const InstallmentSchema = new mongoose.Schema<InstallmentI>({
    id: { type: String, required: true },
    userId: { type: String, required: true },
    investmentId: { type: String, required: true },
    installmentStatus: { types: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    initialAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    paymentDelay: { type: Number, default: 0 },
});

export default mongoose.model("Installment", InstallmentSchema);
