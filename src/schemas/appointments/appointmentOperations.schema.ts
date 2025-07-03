import { z } from "zod";
import mongoose from "mongoose";
import { UserModel } from "models/user.model";

// Schema para confirmar cita
export const appointmentConfirmSchema = z.object({
    employeeId: z
        .string({
            required_error: "Employee ID is required",
        })
        .refine((id) => mongoose.Types.ObjectId.isValid(id), {
            message: "Invalid employee ID format",
        })
        .superRefine(async (employeeId, ctx) => {
            const employee = await UserModel.findById(employeeId);
            if (!employee) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Employee not found",
                    path: ["employeeId"],
                });
                return false;
            }
            return true;
        }),
    notes: z
        .string()
        .max(500, "Notes cannot exceed 500 characters")
        .optional(),
});

// Schema para cancelar cita
export const appointmentCancelSchema = z.object({
    reason: z
        .string({
            required_error: "Cancellation reason is required",
        })
        .min(5, "Reason must be at least 5 characters")
        .max(500, "Reason cannot exceed 500 characters"),
});

// Schema para reprogramar cita
export const appointmentRescheduleSchema = z.object({
    newDate: z
        .string({
            required_error: "New date is required",
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
            message: "New date cannot be in the past",
        }),
    newStartTime: z
        .string({
            required_error: "New start time is required",
        })
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
            message: "Invalid time format. Use HH:MM format (24-hour)",
        }),
    reason: z
        .string()
        .min(5, "Reason must be at least 5 characters")
        .max(500, "Reason cannot exceed 500 characters")
        .optional(),
});

// Schema para completar cita
export const appointmentCompleteSchema = z.object({
    actualCost: z
        .number()
        .min(0, "Actual cost cannot be negative")
        .optional(),
    notes: z
        .string()
        .max(1000, "Notes cannot exceed 1000 characters")
        .optional(),
    serviceCompleted: z
        .boolean()
        .default(true),
    qualityRating: z
        .number()
        .min(1, "Rating must be at least 1")
        .max(5, "Rating cannot exceed 5")
        .optional(),
});

// Schema para consultar slots disponibles
export const availableSlotsQuerySchema = z.object({
    date: z
        .string({
            required_error: "Date is required",
        })
        .datetime({
            message: "Invalid date format. Use ISO 8601 format",
        }),
    serviceType: z
        .string()
        .optional(),
});

// Schema para consultar calendario mensual
export const calendarQuerySchema = z.object({
    month: z
        .string({
            required_error: "Month is required",
        })
        .regex(/^(0?[1-9]|1[0-2])$/, {
            message: "Month must be between 1 and 12",
        }),
    year: z
        .string({
            required_error: "Year is required",
        })
        .regex(/^\d{4}$/, {
            message: "Year must be a 4-digit number",
        }),
    serviceType: z
        .string()
        .optional(),
});

// Schema para verificar múltiples fechas
export const checkMultipleDatesSchema = z.object({
    dates: z
        .array(z.string().datetime({
            message: "Invalid date format. Use ISO 8601 format",
        }))
        .min(1, "At least one date is required")
        .max(31, "Maximum 31 dates allowed per request"),
    serviceType: z
        .string()
        .optional(),
});

// Schema para consultar fechas ocupadas
export const busyDatesQuerySchema = z.object({
    startDate: z
        .string({
            required_error: "Start date is required",
        })
        .datetime({
            message: "Invalid date format. Use ISO 8601 format",
        }),
    endDate: z
        .string({
            required_error: "End date is required",
        })
        .datetime({
            message: "Invalid date format. Use ISO 8601 format",
        }),
}).refine((data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 90;
}, {
    message: "Date range cannot exceed 90 days",
    path: ["endDate"],
});

export type AppointmentConfirmData = z.infer<typeof appointmentConfirmSchema>;
export type AppointmentCancelData = z.infer<typeof appointmentCancelSchema>;
export type AppointmentRescheduleData = z.infer<typeof appointmentRescheduleSchema>;
export type AppointmentCompleteData = z.infer<typeof appointmentCompleteSchema>;
export type AvailableSlotsQuery = z.infer<typeof availableSlotsQuerySchema>;
export type CalendarQuery = z.infer<typeof calendarQuerySchema>;
export type CheckMultipleDatesData = z.infer<typeof checkMultipleDatesSchema>;
export type BusyDatesQuery = z.infer<typeof busyDatesQuerySchema>;
