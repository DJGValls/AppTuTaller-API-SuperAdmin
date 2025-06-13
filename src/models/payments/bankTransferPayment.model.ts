import mongoose from "mongoose";
import { PaymentMethodModel } from "./paymentMethod.model";
import { BankAccountPayment } from "types/PaymentTypes";
const bankAccountPaymentSchema = new mongoose.Schema<BankAccountPayment>({
    accountNumber: {
        type: String,
        required: true
    },
    bankName: {
        type: String,
        required: true
    },
    accountHolderName: {
        type: String,
        required: true
    },
    swiftCode: {
        type: String,
        required: true
    },
    iban: {
        type: String,
        required: true
    }
});
export const BankAccountPaymentModel = PaymentMethodModel.discriminator("BANK_ACCOUNT", bankAccountPaymentSchema);