import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string({
        required_error: "Name is required"
    }).min(3, {
        message: "Name must be at least 3 characters long"
    }),
    firstName: z.string({
        required_error: "First name is required"
    }).min(2, {
        message: "First name must be at least 2 characters long"
    }),
    lastName: z.string({
        required_error: "Last name is required"
    }).min(2, {
        message: "Last name must be at least 2 characters long"
    }),
    email: z.string({
        required_error: "Email is required"
    }).email({
        message: "Invalid email format"
    }),
    password: z.string({
        required_error: "Password is required"
    }).min(6, {
        message: "Password must be at least 6 characters long"
    }),
    phone: z.string({
        required_error: "Phone is required"
    }).min(9, {
        message: "Phone must be at least 9 characters long"
    })
});

export const loginSchema = z.object({
    email: z.string({
        required_error: "Email is required"
    }).email({
        message: "Invalid email format"
    }),
    password: z.string({
        required_error: "Password is required"
    }).min(4, {
        message: "Password must be at least 6 characters long"
    })
});