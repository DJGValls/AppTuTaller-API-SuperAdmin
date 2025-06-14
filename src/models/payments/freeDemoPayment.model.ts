import mongoose, { Schema } from "mongoose";
import { PaymentMethodModel } from "./paymentMethod.model";
import { FreeDemoPayment } from "types/payments/FreeDemoPaymentTypes";
const freeDemoPaymentSchema = new mongoose.Schema<FreeDemoPayment>(
    {
        dateStart: {
            type: Date,
            required: true,
            default: Date.now(),
        },
        expirationDate: {
            type: Date,
            required: true,
            //por defecto 15 dias desde el dia de hoy
            default: () => {
                const today = new Date();
                today.setDate(today.getDate() + 15);
                return today;
            },
        },
        expirated: {
            type: Boolean,
            required: true,
            default: false,
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
export const FreeDemoPaymentModel = PaymentMethodModel.discriminator("FREE_DEMO", freeDemoPaymentSchema);
