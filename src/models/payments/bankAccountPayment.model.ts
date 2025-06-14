import mongoose, { Schema } from "mongoose";
import { PaymentMethodModel } from "./paymentMethod.model";
import { BankAccountPayment } from "types/payments/BankAccountPaymentTypes";
const bankAccountPaymentSchema = new mongoose.Schema<BankAccountPayment>(
    {
        accountNumber: {
            type: String,
            required: true,
        },
        bankName: {
            type: String,
            required: true,
        },
        accountHolderName: {
            type: String,
            required: true,
        },
        swiftCode: {
            type: String,
            required: true,
        },
        iban: {
            type: String,
            required: true,
        },
        deletedAt: Date,
        deletedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);
export const BankAccountPaymentModel = PaymentMethodModel.discriminator("BANK_ACCOUNT", bankAccountPaymentSchema);
