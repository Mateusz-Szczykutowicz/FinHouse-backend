import mongoose from "mongoose";

const FolderSchema = new mongoose.Schema({
    id: { type: String, required: true },
    userId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    tel: { type: String, required: true },
    createdAt: { type: Date, default: new Date() },
});

export default mongoose.model("Folder", FolderSchema);
