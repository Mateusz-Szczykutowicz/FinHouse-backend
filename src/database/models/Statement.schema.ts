import mongoose from "mongoose";
import { StatementI } from "../../interfaces/Statement.interface";

const StatementSchema = new mongoose.Schema<StatementI>({
    id: { type: String, required: true },
    userId: { type: String, required: true },
    name: { type: String, required: true },
    createdAt: { type: Date, default: new Date() },
});

export default mongoose.model("Statement", StatementSchema);
