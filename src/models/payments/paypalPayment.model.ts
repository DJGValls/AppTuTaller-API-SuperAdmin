import mongoose, { Schema } from "mongoose";
import { PaymentMethodModel } from "./paymentMethod.model";
import { PaypalPayment } from "types/payments/PaypalPaymentTypes";
const paypalPaymentSchema = new mongoose.Schema<PaypalPayment>(
    {
        email: {
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
export const PaypalPaymentModel = PaymentMethodModel.discriminator("PAYPAL", paypalPaymentSchema);
