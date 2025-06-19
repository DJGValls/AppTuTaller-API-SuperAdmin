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
    durationInDays: z
        .number({
            required_error: "Duration in days is required",
        })
        .min(1, {
            message: "Duration must be at least 1 day",
        }),
    isRecurring: z
        .boolean({
            required_error: "Recurring status is required",
        })
        .default(false),
    expirationDate: z
        .string({
            required_error: "Expiration date is required",
        })
        .transform((str) => new Date(str))
        .refine((date) => date > new Date(), {
            message: "Expiration date must be in the future",
        })
        .optional(),
});
