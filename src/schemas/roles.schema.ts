import { z } from "zod";
export const rolesSchema = z.object({
    name: z.string({
        required_error: "Name is required",
    }).min(2, "Name must be at least 2 characters"),
});