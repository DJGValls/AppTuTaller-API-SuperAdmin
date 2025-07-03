import { z } from "zod";
import mongoose from "mongoose";
import { AppointmentStatusEnum, ServiceTypeEnum } from "enums/AppointmentStatus.enums";
import { WorkshopModel } from "models/workshop.model";
import { UserModel } from "models/user.model";

export const appointmentUpdateSchema = z
    .object({
        // Referencia al taller (opcional en actualización)
        workshop: z
            .string()
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
            })
            .optional(),

        // Cliente (opcional en actualización)
        client: z
            .string()
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
            })
            .optional(),

        // Fecha de la cita (opcional en actualización)
        appointmentDate: z
            .string()
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
            })
            .optional(),

        // Hora de inicio (opcional en actualización)
        startTime: z
            .string()
            .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
                message: "Invalid time format. Use HH:MM format (24-hour)",
            })
            .optional(),

        // Tipo de servicio (opcional en actualización)
        serviceType: z
            .nativeEnum(ServiceTypeEnum, {
                invalid_type_error: "Invalid service type",
            })
            .optional(),

        // Duración en minutos (opcional)
        duration: z
            .number()
            .min(15, "Duration must be at least 15 minutes")
            .max(480, "Duration cannot exceed 8 hours")
            .optional(),

        // Estado de la cita (opcional)
        status: z
            .nativeEnum(AppointmentStatusEnum, {
                invalid_type_error: "Invalid appointment status",
            })
            .optional(),

        // Descripción del problema/servicio (opcional en actualización)
        description: z
            .string()
            .min(10, "Description must be at least 10 characters")
            .max(500, "Description cannot exceed 500 characters")
            .optional(),

        // Costo estimado (opcional)
        estimatedCost: z
            .number()
            .min(0, "Estimated cost cannot be negative")
            .optional(),

        // Costo final (opcional)
        finalCost: z
            .number()
            .min(0, "Final cost cannot be negative")
            .optional(),

        // Prioridad (opcional)
        priority: z
            .enum(["LOW", "NORMAL", "HIGH", "URGENT"])
            .optional(),

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

        // Razón de cancelación (opcional, para cuando se cancela)
        cancellationReason: z
            .string()
            .max(500, "Cancellation reason cannot exceed 500 characters")
            .optional(),
    })
    .refine(
        (data) => {
            // Validar que la hora de inicio esté en formato válido si está presente
            if (data.startTime) {
                const [hours, minutes] = data.startTime.split(':').map(Number);
                return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
            }
            return true;
        },
        {
            message: "Invalid start time",
            path: ["startTime"],
        }
    );

export type AppointmentUpdateData = z.infer<typeof appointmentUpdateSchema>;
