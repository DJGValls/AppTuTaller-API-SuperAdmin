import { z } from "zod";
import mongoose from "mongoose";
import { UserTypesEnum } from "enums/UserTypes.enums";
export const userUpdateSchema = z
    .object({
        // Campos básicos del usuario (todos opcionales para actualización)
        email: z
            .string()
            .email({
                message: "Invalid email format",
            })
            .optional(),
        password: z
            .string()
            .min(6, {
                message: "Password must be at least 6 characters",
            })
            .optional(),
        // Información de contacto
        contact: z
            .string()
            .refine((val) => mongoose.Types.ObjectId.isValid(val), {
                message: "Invalid Contact ID format",
            })
            .optional(),
        // Tipos de usuario y roles (opcionales para actualización)
        userTypes: z
            .array(z.nativeEnum(UserTypesEnum))
            .min(1, {
                message: "At least one user type is required when updating types",
            })
            .optional(),
        roles: z
            .array(
                z.string()
            )
            .min(1, {
                message: "At least one role is required when updating roles",
            })
            .optional(),
        // Permisos (opcional)
        permissions: z.array(z.string()).optional(),
        // Perfiles específicos por tipo de usuario (opcionales)
        workshopAdminProfile: z
            .object({
                managedWorkshops: z
                    .array(
                        z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
                            message: "Invalid Workshop ID format",
                        })
                    )
                    .optional(),
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
            })
            .optional(),
    })
    .refine(
        (data) => {
            // Solo validar los perfiles si se están actualizando los tipos de usuario
            if (!data.userTypes) return true;
            const hasWorkshopAdmin = data.userTypes.includes(UserTypesEnum.WORKSHOP_ADMIN);
            const hasEmployee = data.userTypes.includes(UserTypesEnum.EMPLOYEE);
            const hasClient = data.userTypes.includes(UserTypesEnum.CLIENT);
            if (hasWorkshopAdmin && !data.workshopAdminProfile) return false;
            if (hasEmployee && !data.employeeProfile) return false;
            if (hasClient && !data.clientProfile) return false;
            return true;
        },
        {
            message: "User profiles must match the selected user types",
        }
    );
