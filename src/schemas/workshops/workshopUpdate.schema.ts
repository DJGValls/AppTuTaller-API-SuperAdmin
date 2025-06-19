import { z } from "zod";
import mongoose from "mongoose";
import { ActivationStatus } from "enums/StatusMethods.enum";
export const workshopUpdateSchema = z.object({
    name: z
        .string({
            required_error: "Name is required",
        })
        .min(3, {
            message: "Name must be at least 3 characters long",
        })
        .optional(),

    contact: z
        .string()
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
            message: "Invalid Contact ID format",
        })
        .optional(),

    status: z.nativeEnum(ActivationStatus).optional(),

    paymentMethod: z
        .string()
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
            message: "Invalid Payment Method ID format",
        })
        .optional(),
    subscription: z
        .string()
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
            message: "Invalid Subscription ID format",
        })
        .optional(),

    workshopAdmin: z
        .string()
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
            message: "Invalid Workshop Admin ID format",
        })
        .optional(),
        
    employees: z
        .array(
            z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
                message: "Invalid Employee ID format",
            })
        )
        .optional(),
});
