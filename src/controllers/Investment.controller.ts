import sha256 from "sha256";
import FolderSchema from "../database/models/Folder.schema";
import InvestmentSchema from "../database/models/Investment.schema";
import { investemntControllerI } from "../interfaces/Investment.interface";

const InvestmentController: investemntControllerI = {
    getAllInvestments: async (req, res) => {
        const userId = req.body.secure.id;
        const investments = await InvestmentSchema.find({ userId });
        return res
            .status(200)
            .json({ message: "All investments", status: 200, investments });
    },
    getAllInvestmentsInFolder: async (req, res) => {
        const folderId = req.params.id;
        const userId = req.body.secure.id;
        const investments = await InvestmentSchema.find({ folderId, userId });
        return res.status(200).json({
            message: "All investments in folder",
            status: 200,
            investments,
        });
    },
    getOneInvestment: async (req, res) => {
        const id = req.params.id;
        const investemnt = await InvestmentSchema.findOne({ id });
        return res
            .status(200)
            .json({ message: "One investment", status: 200, investemnt });
    },
    createNewInwestment: async (req, res) => {
        if (
            !req.body.folderId ||
            !req.body.startDate ||
            !req.body.endDate ||
            !req.body.initialAmount
        ) {
            return res.status(400).json({
                message:
                    "Folder ID or start date or end date or initial amount field is empty",
                status: 400,
            });
        }
        const userId = req.body.secure.id;
        const { folderId, startDate, endDate, initialAmount } = req.body;
        const elementsOfStartDate = startDate.split(".");
        const dateStart = new Date(
            elementsOfStartDate[2] * 1,
            elementsOfStartDate[1] * 1 - 1,
            elementsOfStartDate[0] * 1 + 1
        );
        const elementsOfEndDate = endDate.split(".");
        const dateEnd = new Date(
            elementsOfEndDate[2] * 1,
            elementsOfEndDate[1] * 1 - 1,
            elementsOfEndDate[0] * 1 + 1
        );
        const folder = await FolderSchema.findOne({ id: folderId });
        if (!folder) {
            return res
                .status(404)
                .json({ message: "Folder does not exist", status: 404 });
        }
        const investment = new InvestmentSchema();
        const id = sha256(
            `${folderId}+${userId}#${investment.get("_id")}!${Math.random()}`
        );
        investment.set("id", id);
        investment.set("userId", userId);
        investment.set("folderId", folderId);
        investment.set("firstName", folder.get("firstName"));
        investment.set("lastName", folder.get("lastName"));
        investment.set("tel", folder.get("tel"));
        investment.set("email", folder.get("email"));
        investment.set("startDate", dateStart);
        investment.set("endDate", dateEnd);
        investment.set("initialAmount", initialAmount * 1);
        investment.set("commission", initialAmount * 1 * 0.04);

        investment.save();
        return res
            .status(201)
            .json({ message: "Investment success created", status: 201 });
    },
};

export default InvestmentController;
