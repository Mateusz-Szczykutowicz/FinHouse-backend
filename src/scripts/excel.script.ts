import internal from "stream";
import Excel from "exceljs";
import InstallmentSchema from "../database/models/Installment.schema";
import OperationSchema from "../database/models/Operation.schema";
import { customAlphabet } from "nanoid";
import StatementSchema from "../database/models/Statement.schema";

const findExcel = async (
    excel: internal.Stream,
    investmentName: string,
    secureID: string,
    investmentId: string,
    statementId: string,
    userId: string
) => {
    const regex = new RegExp(investmentName, "i");
    const workbook = new Excel.Workbook();
    await workbook.xlsx.read(excel);
    const worksheet = workbook.getWorksheet("excel");
    if (!worksheet) {
        return false;
    }

    worksheet.eachRow(async (row, n) => {
        if (n <= 0) {
            return false;
        }
        const values = JSON.stringify(row.values);
        const tab = JSON.parse(values);
        const name = tab[2];
        if (regex.test(name)) {
            const price: string = tab[5];
            console.log("name :>> ", name);
            let value = Math.ceil(
                parseFloat(
                    price
                        .split(" PLN")[0]
                        .split(" ")
                        .join("")
                        .split(",")
                        .join(".")
                )
            );
            console.log("price :>> ", value);
            const operation = new OperationSchema();
            const nanoid = customAlphabet("ABCDEF1234567890", 12);
            const id = nanoid();
            operation.set("id", id);
            operation.set("userId", userId);
            operation.set("name", investmentName);
            operation.set("amount", value);
            operation.set("statementId", statementId);
            operation.set("title", name);
            operation.save();
            console.log("investmentId :>> ", investmentId);
            const installments = await InstallmentSchema.find({
                userId: secureID,
                investmentId,
            });
            // console.log("installments :>> ", installments);
            for (const installment of installments) {
                if (value <= 0) {
                    installment.save();
                    break;
                }
                const paidAmount = installment.get("paidAmount");
                const initialAmount = installment.get("initialAmount");
                const rest = initialAmount - (value + paidAmount);
                console.log("paidAmount :>> ", paidAmount);
                console.log("initialAmount :>> ", initialAmount);
                console.log("rest :>> ", rest);
                if (initialAmount - paidAmount > 0) {
                    console.log("wchodzę :>> ");
                    if (rest >= 0) {
                        installment.set("paidAmount", value);
                        value = 0;
                    } else {
                        installment.set("paidAmount", initialAmount);
                        value += paidAmount;
                        value -= initialAmount;
                    }
                }
                console.log("installment :>> ", installment);
                installment.save();
            }
        }
    });
};

export default findExcel;
