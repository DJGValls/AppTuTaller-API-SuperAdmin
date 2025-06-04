import { z } from "zod";
export const subscriptionDurationCreateSchema = z.object({
    title: z
        .string({
            required_error: "Title is required",
        })
        .min(3, {
            message: "Title must be at least 3 characters long",
        })
        .max(20, {
            message: "Title must be at most 20 characters long",
        }),
    description: z
        .string({
            required_error: "Description is required",
        })
        .min(3, {
            message: "Description must be at least 3 characters long",
        })
        .max(200, {
            message: "Description must be at most 200 characters long",
        }),
    expirationDate: z
        .date({
            required_error: "Expiration date is required",
        })
        .min(new Date(), {
            message: "Expiration date must be in the future",
        }),
});
