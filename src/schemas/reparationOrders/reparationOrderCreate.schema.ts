import { z } from "zod";
import mongoose from "mongoose";
export const reparationOrderCreateSchema = z.object({
    name: z
        .string({
            required_error: "Name is required",
        })
        .min(3, {
            message: "Name must be at least 3 characters long",
        }),

    description: z
        .string({
            required_error: "Descreiption is required",
        })
        .min(3, {
            message: "Description must be at least 3 characters long",
        }),

    workshop: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid workshop ID format",
    }),

    reparationTasks: z
        .array(
            z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
                message: "Invalid reparationTask ID format",
            })
        )
        .optional(),
});
