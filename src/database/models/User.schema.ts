import mongoose from "mongoose";
import { userI, userStatusE } from "../../interfaces/User.interface";

const UserSchema = new mongoose.Schema<userI>({
    id: { type: String, required: true },
    secureID: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    admin: { type: Boolean, default: false },
    adress: { type: String, required: true },
    investmentAmount: { type: Number, required: true },
    name: { type: String, required: true },
    tel: { type: String, required: true },
    createdAt: { type: Date, default: new Date() },
    status: { type: String, default: userStatusE.INPROGRESS },
});

export default mongoose.model("User", UserSchema);
