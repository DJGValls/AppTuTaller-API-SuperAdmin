import mongoose, { Schema } from "mongoose";
import { Subscription } from "../types/SubscriptionsTypes";


const subscriptionSchema = new mongoose.Schema<Subscription>(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        maxEmployees:{
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
       subscriptionDuration: {
            type: Schema.Types.ObjectId,
            ref: "SubscriptionDuration",
            required: true
        },
        deletedAt: Date,
        deletedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const SubscriptionModel = mongoose.model<Subscription>("Subscription", subscriptionSchema);
