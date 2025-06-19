import mongoose, { Schema } from "mongoose";
import { Contact } from "types/ContactTypes";
const contactSchema = new mongoose.Schema<Contact>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        workshopId: {
            type: Schema.Types.ObjectId,
            ref: "Workshop",
        },
        name: {
            type: String,
            required: true,
        },
        surname: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        postalCode: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        cif: {
            type: String,
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
export const ContactModel = mongoose.model<Contact>("Contact", contactSchema);
