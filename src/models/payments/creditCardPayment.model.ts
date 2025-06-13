import mongoose from "mongoose";
import { PaymentMethodModel } from "./paymentMethod.model";
import { CreditCard } from "types/PaymentTypes";
const creditCardPaymentSchema = new mongoose.Schema<CreditCard>({
    cardNumber: {
        type: String,
        required: true
    },
    cardHolderName: {
        type: String,
        required: true
    },
    expirationDate: {
        type: Date,
        required: true
    },
    cvv: {
        type: String,
        required: true
    }
});
export const CreditcardPaymentModel = PaymentMethodModel.discriminator("CREDIT_CARD", creditCardPaymentSchema);