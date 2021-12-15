import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    id: { type: String, required: true },
    login: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    admin: { type: Boolean, default: false },
});

export default mongoose.model("User", UserSchema);
