import express from "express";
import cors from "cors";
import userRouter from "./routes/user.router";
import db from "./database/server.db";
import investorRouter from "./routes/Investor.router";
import investmentRouter from "./routes/Investment.router";
import installmentRouter from "./routes/Installment.router";
import "./scripts/checkTime.script";
import morgan from "morgan";

const app = express();

db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("DB connection - success");
});

//? DEV
app.use(morgan("dev"));

//? Config
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ mess: "ok" });
});

app.use("/users", userRouter);
app.use("/investors", investorRouter);
app.use("/investments", investmentRouter);
app.use("/installments", installmentRouter);

app.use((req, res) => {
    req;
    res.status(404).json({ message: "Route does not exist", status: 404 });
});

export default app;
