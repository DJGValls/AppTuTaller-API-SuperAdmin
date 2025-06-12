import { z } from "zod";
import mongoose from "mongoose";
import { UserTypesEnum } from "enums/UserTypes.enums";
import { UserModel } from "models/user.model";
import { RolesModel } from "models/roles.model";
export const userCreateSchema = z
    .object({
        // Campos básicos del usuario
        email: z
            .string({
                required_error: "Email is required",
            })
            .email({
                message: "Invalid email format",
            })
            .superRefine(async (email, ctx) => {
                const existingUser = await UserModel.findOne({
                    email,
                    deletedAt: null,
                });
                if (existingUser) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Email already exists",
                        path: ["email"],
                    });
                    return false;
                }
                return true;
            }),
        password: z
            .string({
                required_error: "Password is required",
            })
            .min(6, {
                message: "Password must be at least 6 characters",
            }),
        // Campo de contacto requerido
        contact: z.union([
            z
                .string({
                    required_error: "Contact is required",
                })
                .refine((val) => mongoose.Types.ObjectId.isValid(val), {
                    message: "Invalid Contact ID format",
                }),
            z.object({
                name: z
                    .string({
                        required_error: "Contact name is required",
                    })
                    .min(2, {
                        message: "Name must be at least 2 characters long",
                    }),
                surname: z
                    .string({
                        required_error: "Contact surname is required",
                    })
                    .min(2, {
                        message: "Surname must be at least 2 characters long",
                    }),
                phone: z
                    .string({
                        required_error: "Contact phone is required",
                    })
                    .min(9, {
                        message: "Phone must be at least 9 characters long",
                    }),
                address: z
                    .string({
                        required_error: "Contact address is required",
                    })
                    .min(5, {
                        message: "Address must be at least 5 characters long",
                    }),
                state: z.string({
                    required_error: "Contact state is required",
                }),
                city: z.string({
                    required_error: "Contact city is required",
                }),
                postalCode: z.string({
                    required_error: "Contact postal code is required",
                }),
                country: z.string({
                    required_error: "Contact country is required",
                }),
            }),
        ]),
        // Tipos de usuario y roles
        userTypes: z
            .array(z.nativeEnum(UserTypesEnum))
            .refine((types) => types.length > 0, {
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
            }),
        // Permisos
        // Perfiles específicos por tipo de usuario
        workshopAdminProfile: z
            .object({
                managedWorkshops: z
                    .array(
                        z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
                            message: "Invalid Workshop ID format",
                        })
                    )
                    .optional(),
                    isWorkshopAdmin: z.boolean().optional(),
            })
            .optional(),
        employeeProfile: z
            .object({
                workshops: z
                    .array(
                        z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
                            message: "Invalid Workshop ID format",
                        })
                    )
                    .optional(),
                isEmployee: z.boolean().optional(),
                category: z.string().optional(),
                speciality: z.string().optional(),
            })
            .optional(),
        clientProfile: z
            .object({
                preferredWorkshops: z
                .array(
                    z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
                        message: "Invalid Workshop ID format",
                    })
                )
                .optional(),
                isClient: z.boolean().optional(),
            })
            .optional(),
    })
    .refine(
        (data) => {
            // Validar que los perfiles correspondan con los tipos de usuario
            const hasWorkshopAdmin = data.userTypes.includes(UserTypesEnum.WORKSHOP_ADMIN);
            const hasEmployee = data.userTypes.includes(UserTypesEnum.EMPLOYEE);
            const hasClient = data.userTypes.includes(UserTypesEnum.CLIENT);
            // Si es workshop admin o employee, requiere sus perfiles específicos
            if (hasWorkshopAdmin && !data.workshopAdminProfile) {
                return false;
            }
            if (hasEmployee && !data.employeeProfile) {
                return false;
            }
            // Para clientes, establecer perfil por defecto si no se proporciona
            if (hasClient && !data.clientProfile) {
                return false
            }
            return true;
        },
        {
            message: "User profiles must match the selected user types",
        }
    );
