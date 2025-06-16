import mongoose, { Schema } from "mongoose";
import { PaymentMethodModel } from "./paymentMethod.model";
import { StripePayment } from "types/payments/StripePaymentTypes";
const stripePaymentSchema = new mongoose.Schema<StripePayment>(
    {
        stripeCustomerId: {
            type: String,
            required: true,
        },
        stripeSubscriptionId: {
            type: String,
            required: true,
        },
        stripePriceId: {
            type: String,
            required: true,
        },
        stripeProductId: {
            type: String,
            required: true,
        },
        currentPeriodStart: {
            type: Date,
            required: true,
        },
        currentPeriodEnd: {
            type: Date,
            required: true,
        },
        cancelAtPeriodEnd: {
            type: Boolean,
            default: false,
        },
        status: {
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
export const StripePaymentModel = PaymentMethodModel.discriminator("STRIPE", stripePaymentSchema);