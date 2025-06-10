import mongoose from "mongoose";
import { z } from "zod";
export const contactCreateSchema = z.object({
    userId: z
        .string({
            required_error: "User ID is required",
        })
        .min(1, {
            message: "User ID cannot be empty",
        })
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
            message: "Invalid User ID format",
        }),
    name: z
        .string({
            required_error: "Name is required",
        })
        .min(2, {
            message: "Name must be at least 2 characters long",
        }),
    surname: z
        .string({
            required_error: "Surname is required",
        })
        .min(2, {
            message: "Surname must be at least 2 characters long",
        }),
    phone: z
        .string({
            required_error: "Phone is required",
        })
        .min(9, {
            message: "Phone must be at least 9 characters long",
        }),
    address: z
        .string({
            required_error: "Address is required",
        })
        .min(5, {
            message: "Address must be at least 5 characters long",
        }),
    state: z.string({
        required_error: "State is required",
    }),
    city: z.string({
        required_error: "City is required",
    }),
    postalCode: z.string({
        required_error: "Postal code is required",
    }),
    country: z.string({
        required_error: "Country is required",
    }),
});
