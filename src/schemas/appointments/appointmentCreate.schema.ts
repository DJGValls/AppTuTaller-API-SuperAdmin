import { z } from "zod";
import mongoose from "mongoose";
import { AppointmentStatusEnum, ServiceTypeEnum } from "enums/AppointmentStatus.enums";
import { WorkshopModel } from "models/workshop.model";
import { UserModel } from "models/user.model";

export const appointmentCreateSchema = z
    .object({
        // Referencia al taller (requerido)
        workshop: z
            .string({
                required_error: "Workshop is required",
            })
            .refine((id) => mongoose.Types.ObjectId.isValid(id), {
                message: "Invalid workshop ID format",
            })
            .superRefine(async (workshopId, ctx) => {
                const workshop = await WorkshopModel.findById(workshopId);
                if (!workshop) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Workshop not found",
                        path: ["workshop"],
                    });
                    return false;
                }
                return true;
            }),

        // Cliente (requerido)
        client: z
            .string({
                required_error: "Client is required",
            })
            .refine((id) => mongoose.Types.ObjectId.isValid(id), {
                message: "Invalid client ID format",
            })
            .superRefine(async (clientId, ctx) => {
                const client = await UserModel.findById(clientId);
                if (!client) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Client not found",
                        path: ["client"],
                    });
                    return false;
                }
                return true;
            }),

        // Fecha de la cita (requerido)
        appointmentDate: z
            .string({
                required_error: "Appointment date is required",
            })
            .datetime({
                message: "Invalid date format. Use ISO 8601 format",
            })
            .refine((date) => {
                const appointmentDate = new Date(date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return appointmentDate >= today;
            }, {
                message: "Appointment date cannot be in the past",
            }),

        // Hora de inicio (requerido)
        startTime: z
            .string({
                required_error: "Start time is required",
            })
            .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
                message: "Invalid time format. Use HH:MM format (24-hour)",
            }),

        // Tipo de servicio (requerido)
        serviceType: z
            .nativeEnum(ServiceTypeEnum, {
                required_error: "Service type is required",
                invalid_type_error: "Invalid service type",
            }),

        // Duración en minutos (opcional, se calculará automáticamente si no se proporciona)
        duration: z
            .number()
            .min(15, "Duration must be at least 15 minutes")
            .max(480, "Duration cannot exceed 8 hours")
            .optional(),

        // Descripción del problema/servicio (requerido)
        description: z
            .string({
                required_error: "Description is required",
            })
            .min(10, "Description must be at least 10 characters")
            .max(500, "Description cannot exceed 500 characters"),

        // Costo estimado (opcional)
        estimatedCost: z
            .number()
            .min(0, "Estimated cost cannot be negative")
            .optional(),

        // Prioridad (opcional, por defecto NORMAL)
        priority: z
            .enum(["LOW", "NORMAL", "HIGH", "URGENT"])
            .optional()
            .default("NORMAL"),

        // Notas adicionales (opcional)
        notes: z
            .string()
            .max(1000, "Notes cannot exceed 1000 characters")
            .optional(),

        // Empleado asignado (opcional)
        assignedEmployee: z
            .string()
            .refine((id) => !id || mongoose.Types.ObjectId.isValid(id), {
                message: "Invalid employee ID format",
            })
            .superRefine(async (employeeId, ctx) => {
                if (employeeId) {
                    const employee = await UserModel.findById(employeeId);
                    if (!employee) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: "Employee not found",
                            path: ["assignedEmployee"],
                        });
                        return false;
                    }
                }
                return true;
            })
            .optional(),
    })
    .refine(
        (data) => {
            // Validar que la hora de inicio esté en formato válido
            const [hours, minutes] = data.startTime.split(':').map(Number);
            return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
        },
        {
            message: "Invalid start time",
            path: ["startTime"],
        }
    );
