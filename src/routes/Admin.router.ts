import AdminController from "../controllers/Admin.controller";
import express from "express";
import AuthMiddleware from "../middlewares/Auth.middleware";

const adminRouter = express.Router();

adminRouter.get(
    "/users",
    AuthMiddleware.checkToken,
    AuthMiddleware.isAdmin,
    AdminController.getAllUsers
);

adminRouter.get(
    "/messages",
    AuthMiddleware.checkToken,
    AuthMiddleware.isAdmin,
    AdminController.getAllMessages
);

adminRouter.post(
    "/messages/send",
    AuthMiddleware.checkToken,
    AuthMiddleware.isAdmin,
    AdminController.sendMessage
);

adminRouter.patch(
    "/users/accept",
    AuthMiddleware.checkToken,
    AuthMiddleware.isAdmin,
    AdminController.acceptUser
);

adminRouter.patch(
    "/users/reject",
    AuthMiddleware.checkToken,
    AuthMiddleware.isAdmin,
    AdminController.rejectUser
);

export default adminRouter;
