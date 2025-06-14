import { PaymentMethodEnum } from "enums/PaymentMethods.enums";
import mongoose, { Schema } from "mongoose";
import { PaymentMethod } from "types/payments/PaymentTypes";

const paymentMethodSchema = new mongoose.Schema<PaymentMethod>(
    {
        workshop: {
            type: Schema.Types.ObjectId,
            ref: "Workshop",
            required: true
        },
        type: {
            type: String,
            enum: PaymentMethodEnum,
            required: true
        },
        deletedAt: Date,
        deletedBy: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true,
        versionKey: false,
        discriminatorKey: "type"
    }
);
export const PaymentMethodModel = mongoose.model<PaymentMethod>("PaymentMethod", paymentMethodSchema);