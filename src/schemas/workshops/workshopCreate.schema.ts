import { z } from "zod";
import mongoose from "mongoose";
import { ActivationStatus } from "enums/StatusMethods.enum";
import { contactCreateSchema } from "schemas/contacts/contactCreate.schema";
export const workshopCreateSchema = z.object({
    name: z
        .string({
            required_error: "Name is required",
        })
        .min(3, {
            message: "Name must be at least 3 characters long",
        }),

    contact: z.union([
        z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
            message: "Invalid Contact ID format",
        }),
        contactCreateSchema.omit({ userId: true, workshopId: true }),
    ]),

    status: z.nativeEnum(ActivationStatus).default(ActivationStatus.ACTIVE).optional(),

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
        .string({
            required_error: "Workshop Admin is required",
        })
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
            message: "Invalid Workshop Admin ID format",
        }),

    employees: z
        .array(
            z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
                message: "Invalid Employee ID format",
            })
        )
        .optional(),

    clients: z
        .array(
            z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
                message: "Invalid Employee ID format",
            })
        )
        .optional(),
});
