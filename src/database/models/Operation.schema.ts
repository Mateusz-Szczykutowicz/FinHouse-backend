import mongoose from "mongoose";
import { OperationI } from "../../interfaces/Operation.interface";

const OperationSchema = new mongoose.Schema<OperationI>({
    id: { type: String, required: true },
    statementId: { type: String, required: true },
    userId: { type: String, required: true },
    name: { type: String, required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    createdAt: { type: Date, default: new Date() },
});

export default mongoose.model("Operation", OperationSchema);
