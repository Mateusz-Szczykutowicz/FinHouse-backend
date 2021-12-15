import express from "express";
import userController from "../controllers/User.controller";
import AuthMiddleware from "../middlewares/Auth.middleware";

const userRouter = express.Router();

userRouter.post("/login", AuthMiddleware.generateToken, userController.login);
userRouter.post("/register", userController.register);
userRouter.get(
    "/",
    AuthMiddleware.checkToken,
    AuthMiddleware.isAdmin,
    (req, res) => {
        return res.json({ mess: "ok" });
    }
);

export default userRouter;
