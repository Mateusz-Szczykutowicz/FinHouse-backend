import InstallmentSchema from "../database/models/Installment.schema";
import Mail from "./Mail.script";

class CheckTime {
    private now = new Date();
    private infiniteLoop = setInterval(() => {
        console.log("now :>> ", this.now);
        console.log("chodzę sobie co 1 godzinę");
        this.paymentRemainder();
        this.demandPayment();
        this.recoveryRequest();
        // this.findLessNow();
    }, 1000 * 60 * 60 * 1);
    private paymentRemainder = async () => {
        const installments = await InstallmentSchema.find();
        for (const installment of installments) {
            const endDate: Date = installment.get("endDate");
            const remaindDate = new Date(endDate);
            remaindDate.setDate(remaindDate.getDate() - 3);
            if (
                remaindDate.getDate() - this.now.getDate() === 0 &&
                remaindDate.getMonth() === this.now.getMonth() &&
                remaindDate.getFullYear() === this.now.getFullYear()
            ) {
                console.log("Przypomnienie o płatności");
                // Mail.sendMail(
                //     "Przypomnienie o płatności",
                //     installment.get("borrowerEmail"),
                //     "Za 3 dni upływa termin zapłaty"
                // );
            }
        }
    };
    private demandPayment = async () => {
        const installments = await InstallmentSchema.find();
        for (const installment of installments) {
            const endDate: Date = installment.get("endDate");
            const remaindDate = new Date(endDate);
            remaindDate.setDate(remaindDate.getDate() + 4);
            if (
                remaindDate.getDate() - this.now.getDate() === 0 &&
                remaindDate.getMonth() === this.now.getMonth() &&
                remaindDate.getFullYear() === this.now.getFullYear()
            ) {
                console.log("Masz nieopłacone raty");
                // Mail.sendMail(
                //     "Przypomnienie o płatności",
                //     installment.get("borrowerEmail"),
                //     "Masz nieopłacone raty"
                // );
            }
        }
    };
    private recoveryRequest = async () => {
        const installments = await InstallmentSchema.find();
        for (const installment of installments) {
            const endDate: Date = installment.get("endDate");
            const remaindDate = new Date(endDate);
            remaindDate.setDate(remaindDate.getDate() + 30);
            if (
                remaindDate.getDate() - this.now.getDate() === 0 &&
                remaindDate.getMonth() === this.now.getMonth() &&
                remaindDate.getFullYear() === this.now.getFullYear()
            ) {
                console.log("wezwanie do windykacji");
                // Mail.sendMail(
                //     "Przypomnienie o płatności",
                //     installment.get("borrowerEmail"),
                //     "Masz nieopłacone raty"
                // );
            }
        }
    };
    private findLessNow = async () => {
        const fromDate = new Date(this.now);
        fromDate.setDate(fromDate.getDate() - 10);
        const toDate = new Date(this.now);
        const installments = await InstallmentSchema.find(
            {
                $or: [
                    { endDate: { $lt: fromDate } },
                    { endDate: { $gte: toDate } },
                ],
            },
            "endDate"
        );
        console.log("int :>> ", installments);
    };
}

export default new CheckTime();
