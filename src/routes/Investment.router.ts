import express from "express";
import InvestmentController from "../controllers/Investment.controller";
import AuthMiddleware from "../middlewares/Auth.middleware";
import uploadFiles from "../middlewares/File.middleware";

const investmentRouter = express.Router();

//? Get all user's investemnt
investmentRouter.get(
    "/",
    AuthMiddleware.checkToken,
    // AuthMiddleware.isAdmin,
    InvestmentController.getAllInvestments
);

//? Get all user's investment of investor
investmentRouter.get(
    "/investor/:id",
    AuthMiddleware.checkToken,
    // AuthMiddleware.isAdmin,
    InvestmentController.getAllInvestorInvestments
);

//? Get one user's investment
investmentRouter.get(
    "/id/:id",
    AuthMiddleware.checkToken,
    // AuthMiddleware.isAdmin,
    InvestmentController.getOneInvestment
);

//? Get all investment's installments
investmentRouter.get(
    "/id/:id/installments",
    AuthMiddleware.checkToken,
    // AuthMiddleware.isAdmin,
    InvestmentController.getAllInstallments
);

investmentRouter.get(
    "/id/:id/contract/:file",
    // AuthMiddleware.checkToken,
    // AuthMiddleware.isAdmin,
    InvestmentController.getOneInvestmentContract
);

//? Create new investment
investmentRouter.post(
    "/",
    uploadFiles("investments", "files"),
    AuthMiddleware.checkToken,
    // AuthMiddleware.isAdmin,
    InvestmentController.createNewInwestment
);

//? Get investment overpayment or underpayment
investmentRouter.get(
    "/:id/payment",
    AuthMiddleware.checkToken,
    // AuthMiddleware.isAdmin,
    InvestmentController.getOverpaymentAndUnderpayments
);

//? Get payment delay
investmentRouter.get(
    "/:id/delay",
    AuthMiddleware.checkToken,
    // AuthMiddleware.isAdmin,
    InvestmentController.getPaymentDelay
);

investmentRouter.put(
    "/",
    AuthMiddleware.checkToken,
    InvestmentController.editInvestment
);

//? Delete one investment
investmentRouter.delete(
    "/id/:id",
    AuthMiddleware.checkToken,
    InvestmentController.deleteInvestment
);

export default investmentRouter;
