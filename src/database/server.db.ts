import mongoose from "mongoose";
import config from "../config";

main().catch((err) => console.log(err));

async function main() {
    await mongoose.connect(config.db.local);
}

export default mongoose.connection;
