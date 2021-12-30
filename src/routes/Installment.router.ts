import express from "express";
import InstallmentController from "../controllers/Installment.controller";
import AuthMiddleware from "../middlewares/Auth.middleware";

const installmentRouter = express.Router();

installmentRouter.get("/", AuthMiddleware.checkToken, AuthMiddleware.isAdmin);

installmentRouter.post(
    "/",
    AuthMiddleware.checkToken,
    AuthMiddleware.isAdmin,
    InstallmentController.createNewInstallment
);

export default installmentRouter;
