import express from "express";
import InvestmentController from "../controllers/Investment.controller";
import AuthMiddleware from "../middlewares/Auth.middleware";

const investmentRouter = express.Router();

//? Get all user's investemnt
investmentRouter.get(
    "/",
    AuthMiddleware.checkToken,
    AuthMiddleware.isAdmin,
    InvestmentController.getAllInvestments
);

//? Get all user's investment in folder
investmentRouter.get(
    "/folder/:id",
    AuthMiddleware.checkToken,
    AuthMiddleware.isAdmin,
    InvestmentController.getAllInvestmentsInFolder
);

//? Get one user's investment
investmentRouter.get(
    "/investment/:id",
    AuthMiddleware.checkToken,
    AuthMiddleware.isAdmin,
    InvestmentController.getOneInvestment
);

//? Create new investment
investmentRouter.post(
    "/",
    AuthMiddleware.checkToken,
    AuthMiddleware.isAdmin,
    InvestmentController.createNewInwestment
);

export default investmentRouter;
