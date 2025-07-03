import mongoose, { Schema } from "mongoose";
import { ReparationTask } from "types/ReparationTaskTypes";

const reparationTaskSchema = new mongoose.Schema<ReparationTask>(
    {
        name: {
            type: String,
            required: true,
            index: true,
        },
        description: {
            type: String,
            required: true,
        },
        reparationOrders: [{
            type: Schema.Types.ObjectId,
            ref: "ReparationOrder",
        }],
        status: {
            type: String,
            enum: ["pending", "in_progress", "completed", "cancelled"],
            required: true,
            default: "pending",
        },
        startDate: {
            type: Date,
            required: false,
        },
        endDate: {
            type: Date,
            required: false,
        },
        workshop: {
            type: Schema.Types.ObjectId,
            ref: "Workshop",
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

export const ReparationTaskModel = mongoose.model<ReparationTask>("ReparationTask", reparationTaskSchema);
