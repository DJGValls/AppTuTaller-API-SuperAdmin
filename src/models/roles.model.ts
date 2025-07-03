import mongoose, { Schema } from "mongoose";
import { Roles } from "types/RolesTypes";
const rolesSchema = new mongoose.Schema<Roles>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        permissions: {
            type: [String],
            default: [],
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
export const RolesModel = mongoose.model<Roles>("Roles", rolesSchema);
