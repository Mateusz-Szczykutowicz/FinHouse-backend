import express from "express";
import FolderController from "../controllers/Folder.controller";
import AuthMiddleware from "../middlewares/Auth.middleware";

const folderRouter = express.Router();

folderRouter.get(
    "/",
    AuthMiddleware.checkToken,
    AuthMiddleware.isAdmin,
    FolderController.getAllUserFolders
);

folderRouter.get(
    "/folder/:id",
    AuthMiddleware.checkToken,
    AuthMiddleware.isAdmin,
    FolderController.getOneUserFolder
);

folderRouter.post(
    "/",
    AuthMiddleware.checkToken,
    AuthMiddleware.isAdmin,
    FolderController.createNewFolder
);

export default folderRouter;
