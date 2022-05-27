import express from "express";
import InstallmentController from "../controllers/Installment.controller";
import AuthMiddleware from "../middlewares/Auth.middleware";

const installmentRouter = express.Router();

installmentRouter.get("/", AuthMiddleware.checkToken, AuthMiddleware.isAdmin);

export default installmentRouter;
