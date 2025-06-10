import { z } from "zod";
import mongoose from "mongoose";
import { UserTypesEnum } from "enums/UserTypes.enums";
export const userCreateSchema = z.object({
    email: z
        .string({
            required_error: "Email is required",
        })
        .email({
            message: "Invalid email format",
        }),

    password: z
        .string({
            required_error: "Password is required",
        })
        .min(6, {
            message: "Password must be at least 6 characters",
        }),
    name: z
        .string({
            required_error: "Name is required",
        })
        .min(2, {
            message: "Name must be at least 2 characters long",
        }),
    surname: z
        .string({
            required_error: "Surname is required",
        })
        .min(2, {
            message: "Surname must be at least 2 characters long",
        }),
    phone: z
        .string({
            required_error: "Phone is required",
        })
        .min(9, {
            message: "Phone must be at least 9 characters long",
        }),
    address: z
        .string({
            required_error: "Address is required",
        })
        .min(5, {
            message: "Address must be at least 5 characters long",
        }),
    state: z.string({
        required_error: "State is required",
    }),
    city: z.string({
        required_error: "City is required",
    }),
    postalCode: z.string({
        required_error: "Postal code is required",
    }),
    country: z.string({
        required_error: "Country is required",
    }),
    userTypes: z
        .array(z.nativeEnum(UserTypesEnum), {
            required_error: "User types are required",
        })
        .min(1, {
            message: "At least one user type is required",
        }),
    roles: z
        .array(
            z.string({
                required_error: "Role IDs are required",
            })
        )
        .min(1, {
            message: "At least one role is required",
        })
        .refine((val) => val.every((id) => mongoose.Types.ObjectId.isValid(id)), {
            message: "Invalid Role ID format",
        }),
    permissions: z.array(z.string()).optional(),
    managedWorkshops: z
        .array(
            z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
                message: "Invalid Workshop ID format",
            })
        )
        .optional(),
    employeeWorkshops: z
        .array(
            z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
                message: "Invalid Workshop ID format",
            })
        )
        .optional(),
    clientWorkshops: z
        .array(
            z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
                message: "Invalid Workshop ID format",
            })
        )
        .optional(),
    employeeCategory: z.string().optional(),

    employeeSpeciability: z.string().optional(),
});
