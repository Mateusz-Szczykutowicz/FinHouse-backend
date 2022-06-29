import express from "express";
import userController from "../controllers/User.controller";
import AuthMiddleware from "../middlewares/Auth.middleware";
import multer from "multer";

const userRouter = express.Router();

userRouter.post("/login", AuthMiddleware.generateToken, userController.login);
userRouter.get(
    "/check",
    AuthMiddleware.checkToken,
    AuthMiddleware.isAccept,
    userController.checkToken
);
userRouter.get(
    "/messages",
    AuthMiddleware.checkToken,
    userController.getAllMessages
);
userRouter.get(
    "/messages/id/:id",
    AuthMiddleware.checkToken,
    userController.getOneMessage
);

userRouter.get(
    "/messages/new",
    AuthMiddleware.checkToken,
    userController.getAllNewMessages
);

userRouter.get(
    "/chart/:year/:month",
    AuthMiddleware.checkToken,
    userController.getChartData
);

userRouter.post("/register", userController.register);

userRouter.get(
    "/",
    AuthMiddleware.checkToken,
    // AuthMiddleware.isAdmin,
    userController.getUserInfo
);

userRouter.get(
    "/investments/all",
    AuthMiddleware.checkToken,
    userController.getAllInvestments
);
userRouter.get(
    "/investments/active",
    AuthMiddleware.checkToken,
    userController.getActiveInvestments
);

userRouter.get(
    "/investments/finished",
    AuthMiddleware.checkToken,
    userController.getFinishedInvestments
);

userRouter.get(
    "/investments/delayed",
    AuthMiddleware.checkToken,
    userController.getDelayedInvestments
);

userRouter.get(
    "/investments/income",
    AuthMiddleware.checkToken,
    userController.getIncomeInvestments
);

userRouter.get(
    "/statements",
    AuthMiddleware.checkToken,
    userController.getTwoStatements
);

userRouter.get(
    "/operations",
    AuthMiddleware.checkToken,
    userController.getAllOperations
);

userRouter.post(
    "/excel",
    multer().single("file"),
    AuthMiddleware.checkToken,
    userController.payForInstallments
);

userRouter.put("/", AuthMiddleware.checkToken, userController.editProfile);

export default userRouter;
