import express from "express";
import InvestorController from "../controllers/Investor.controller";
import AuthMiddleware from "../middlewares/Auth.middleware";
import uploadFiles from "../middlewares/File.middleware";

const investorRouter = express.Router();

investorRouter.get(
    "/",
    AuthMiddleware.checkToken,
    // AuthMiddleware.isAdmin,
    InvestorController.getAllUserInvestors
);

investorRouter.get(
    "/id/:id",
    AuthMiddleware.checkToken,
    // AuthMiddleware.isAdmin,
    InvestorController.getOneUserInvestor
);

investorRouter.get(
    "/id/:id/contract/:file",
    AuthMiddleware.checkToken,
    // AuthMiddleware.isAdmin,
    InvestorController.getOneInvestorContract
);

investorRouter.post(
    "/",
    uploadFiles("investors", "files"),
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
