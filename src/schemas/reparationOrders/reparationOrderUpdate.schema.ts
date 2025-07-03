import { z } from "zod";
import mongoose from "mongoose";
export const reparationOrderUpdateSchema = z.object({
     name: z
        .string()
        .min(3, {
            message: "Name must be at least 3 characters long",
        })
        .optional(),

    description: z
        .string()
        .min(3, {
            message: "Description must be at least 3 characters long",
        })
        .optional(),

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
