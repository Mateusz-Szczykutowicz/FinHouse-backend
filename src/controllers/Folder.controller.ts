import sha256 from "sha256";
import FolderSchema from "../database/models/Folder.schema";
import { FolderControllerI } from "../interfaces/Folder.interface";

const FolderController: FolderControllerI = {
    getAllUserFolders: async (req, res) => {
        const userId = req.body.secure.id;
        const folders = await FolderSchema.find({ userId });
        return res
            .status(200)
            .json({ message: "Your all folders", status: 200, folders });
    },
    getOneUserFolder: async (req, res) => {
        const id = req.params.id;
        const userId = req.body.secure.id;
        const folder = await FolderSchema.findOne({ id, userId });
        //! dodać inwestycje <- wszystkie dla folderu
        return res.status(200).json({ message: "Folder", status: 200, folder });
    },
    createNewFolder: (req, res) => {
        if (
            !req.body.firstName ||
            !req.body.lastName ||
            !req.body.tel ||
            !req.body.email
        ) {
            return res.status(400).json({
                message:
                    "First name or last name or tel or email field is empty",
            });
        }
        const userId = req.body.secure.id;
        const { firstName, lastName, tel, email } = req.body;
        const folder = new FolderSchema();
        folder.set("firstName", firstName);
        folder.set("lastName", lastName);
        const id = sha256(
            `${firstName}+${lastName}#${folder.get("_id")}!${Math.random()}`
        );
        folder.set("id", id);
        folder.set("userId", userId);
        folder.set("tel", tel);
        folder.set("email", email);
        folder.save();
        return res.status(201).json({ message: "Folder created", status: 201 });
    },
};

export default FolderController;
