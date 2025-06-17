import { z } from "zod";
import mongoose from "mongoose";
export const contactUpdateSchema = z.object({
    userId: z
        .string()
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
            message: "Invalid User ID format",
        })
        .optional(),
    name: z
        .string({
            required_error: "Name is required",
        })
        .min(3, {
            message: "Name must be at least 3 characters long",
        })
        .optional(),
    surname: z
        .string({
            required_error: "Surname is required",
        })
        .min(2, {
            message: "Surname must be at least 2 characters long",
        })
        .optional(),
    phone: z
        .string({
            required_error: "Phone is required",
        })
        .min(9, {
            message: "Phone must be at least 9 characters long",
        })
        .optional(),
    address: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
    cif: z.string().refine((val) => /^[A-Z]{1}[0-9]{7}[A-Z]{1}$/.test(val), {
        message: "Invalid CIF format",
    }).optional(),
});
