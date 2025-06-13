import mongoose from "mongoose";
import { PaymentMethodModel } from "./paymentMethod.model";
import { PaypalPayment } from "types/PaymentTypes";
const paypalPaymentSchema = new mongoose.Schema<PaypalPayment>({
    email: {
        type: String,
        required: true,
        validate: {
            validator: (email: string) => {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            },
            message: "Invalid email format"
        }
    }
});
export const PaypalPaymentModel = PaymentMethodModel.discriminator("PAYPAL", paypalPaymentSchema);