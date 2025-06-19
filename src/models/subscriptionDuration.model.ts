import mongoose, { Schema } from "mongoose";
import { SubscriptionDuration } from "types/SubscriptionsDurationTypes";

const subscriptionDurationSchema = new mongoose.Schema<SubscriptionDuration>(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        durationInDays: {
            type: Number,
            required: true,
            min: 1,
        },
        isRecurring: {
            type: Boolean,
            default: false,
        },
        expirationDate: {
            type: Date,
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

export const SubscriptionDurationModel = mongoose.model<SubscriptionDuration>(
    "SubscriptionDuration",
    subscriptionDurationSchema
);
