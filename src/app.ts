import express from "express";
import cors from "cors";
import userRouter from "./routes/user.router";
import db from "./database/server.db";
import folderRouter from "./routes/Folder.router";
import investmentRouter from "./routes/Investment.router";
import installmentRouter from "./routes/Installment.router";

const app = express();

db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("DB connection - success");
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ mess: "ok" });
});

app.use("/users", userRouter);
app.use("/folders", folderRouter);
app.use("/investment", investmentRouter);
app.use("/installment", installmentRouter);

app.use((req, res) => {
    req;
    res.status(404).json({ message: "Route does not exist", status: 404 });
});

export default app;
