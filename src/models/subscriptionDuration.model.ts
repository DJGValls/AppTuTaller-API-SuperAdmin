import mongoose, { Schema } from "mongoose";
import { Subscription } from "../types/SubscriptionsTypes";
import { SubscriptionDuration } from "types/SubscriptionsDurationTypes";

const subscriptionDurationSchema = new mongoose.Schema<SubscriptionDuration>(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        createdAt: {
            type: Date,
            requered: true,
        },
        updatedAt: {
            type: Date,
            requered: true,
        },
        expirationDate: {
            type: Date,
            requered: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const SubscriptionDurationModel = mongoose.model<SubscriptionDuration>("SubscriptionDuration", subscriptionDurationSchema);
