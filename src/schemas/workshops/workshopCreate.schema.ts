import { z } from "zod";
export const workshopCreate = z.object({
    name: z.string({
        required_error: "Name is required",
    }).min(3, {
        message: "Name must be at least 3 characters long"
    }),
    paypalEmailContact: z.string().email({
        message: "Invalid email address"
    }),
});