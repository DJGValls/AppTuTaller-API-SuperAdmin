import { z } from "zod";
export const subscriptionCreateSchema = z.object({
    title: z
        .string({
            required_error: "Title is required",
        })
        .min(3, {
            message: "Title must be at least 3 characters long",
        }).max(20, {
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
    price: z
        .number({
            required_error: "Price is required",
        })
        .min(0, {
            message: "Price must be greater than 0",
        }),
    maxEmployees: z
        .number({
            required_error: "Max employees is required",
        })
        .min(1, {
            message: "Max employees must be at least 1",
        }),
    
});