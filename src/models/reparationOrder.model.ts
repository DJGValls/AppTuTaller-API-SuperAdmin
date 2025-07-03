import mongoose, { Schema } from "mongoose";
import { ReparationOrder } from "types/ReparationOrderTypes";

const reparationOrderSchema = new mongoose.Schema<ReparationOrder>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        description: {
            type: String,
            required: true,
        },
        workshop: {
            type: Schema.Types.ObjectId,
            ref: "Workshop",
        },
        reparationTasks: [
            {
                type: Schema.Types.ObjectId,
                ref: "ReparationTask",
            },
        ],
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
export const ReparationOrderModel = mongoose.model<ReparationOrder>("ReparationOrder", reparationOrderSchema);
