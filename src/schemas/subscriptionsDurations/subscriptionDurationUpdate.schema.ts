import { z } from "zod";
export const subscriptionDurationUpdateSchema = z.object({
    title: z
        .string({
            required_error: "Title is required",
        })
        .min(3, {
            message: "Title must be at least 3 characters long",
        })
        .max(20, {
            message: "Title must be at most 20 characters long",
        })
        .optional(),
    durationInDays: z
        .number({
            required_error: "Duration in days is required",
        })
        .min(1, {
            message: "Duration in days must be at least 1",
        })
        .optional(),
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
    subscriptionDuration: z
        .array(
            z.string({
                required_error: "Subscription duration is required",
            })
        )
        .min(1, {
            message: "At least one subscription duration is required",
        })
        .optional(),
});
