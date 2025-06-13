
import { ActivationStatus } from "enums/StatusMethods.enum";
import mongoose, { Schema } from "mongoose";
import { Workshop } from "types/WorkshopTypes";

const workshopSchema = new mongoose.Schema<Workshop>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        contact: {
            type: Schema.Types.ObjectId,
            ref: "Contact",
            required: true
        },
        paymentMethod: {
            type: Schema.Types.ObjectId,
            ref: "PaymentMethod",
            required: true
        },
        status: {
            type: String,
            enum: Object.values(ActivationStatus),
            required: true,
            default: ActivationStatus.ACTIVE
        },
        subscription: {
            type: Schema.Types.ObjectId,
            ref: "Subscription",
            required: true
        },
        workshopAdmin: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        employees: [{
            type: Schema.Types.ObjectId,
            ref: "Users",
        }],
        deletedAt: Date,
        deletedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);
export const WorkshopModel = mongoose.model<Workshop>("Workshop", workshopSchema);