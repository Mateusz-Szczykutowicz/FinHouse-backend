import express from "express";
import InvestorController from "../controllers/Investor.controller";
import AuthMiddleware from "../middlewares/Auth.middleware";
import multer from "multer";

const investorRouter = express.Router();

investorRouter.get(
    "/",
    AuthMiddleware.checkToken,
    // AuthMiddleware.isAdmin,
    InvestorController.getAllUserInvestors
);

investorRouter.get(
    "/investor/:id",
    AuthMiddleware.checkToken,
    // AuthMiddleware.isAdmin,
    InvestorController.getOneUserInvestor
);

investorRouter.post(
    "/",
    multer().single("file"),
    AuthMiddleware.checkToken,
    // AuthMiddleware.isAdmin,
    InvestorController.createNewInvestor
);

investorRouter.put(
    "/",
    AuthMiddleware.checkToken,
    // AuthMiddleware.isAdmin,
    InvestorController.editInvestor
);

export default investorRouter;
