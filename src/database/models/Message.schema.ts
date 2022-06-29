import mongoose from "mongoose";
import { MessageI } from "../../interfaces/Message.interface";

const MessageSchema = new mongoose.Schema<MessageI>({
    id: { type: String, required: true },
    sender: { type: String, required: true },
    sendTo: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    isNewStatus: { type: Boolean, default: true },
});

export default mongoose.model("Message", MessageSchema);
