import { z } from "zod";
export const subscriptionSchema = z.object({
    title: z.string({
        required_error: "Title is required",
    }).min(3, {
        message: "Title must be at least 3 characters long"
    }),
    description: z.string({
        required_error: "Description is required",
    }).min(3, {
        message: "Description must be at least 3 characters long"
    }),
    price: z.number({
        required_error: "Price is required",
    }).min(0, {
        message: "Price must be greater than 0"
    }),
    durationType: z.string({
        required_error: "Duration type is required",
    }).min(1, {
        message: "Duration type must be at least 1 characters long"
    })
    
});