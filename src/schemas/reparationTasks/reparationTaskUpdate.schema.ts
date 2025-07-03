import { z } from "zod";

export const reparationTaskUpdateSchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(3, {
                message: "El nombre debe tener al menos 3 caracteres",
            })
            .max(100, {
                message: "El nombre no puede tener más de 100 caracteres",
            })
            .optional(),
        description: z
            .string()
            .min(10, {
                message: "La descripción debe tener al menos 10 caracteres",
            })
            .max(500, {
                message: "La descripción no puede tener más de 500 caracteres",
            })
            .optional(),
        reparationOrders: z
            .array(z.string().regex(/^[0-9a-fA-F]{24}$/, "ID de orden de reparación inválido"))
            .optional(),
        status: z
            .enum(["pending", "in_progress", "completed", "cancelled"], {
                message: "Estado inválido. Debe ser: pending, in_progress, completed o cancelled",
            })
            .optional(),
        startDate: z
            .string()
            .refine((date) => !isNaN(Date.parse(date)), {
                message: "Fecha de inicio inválida",
            })
            .optional(),
        endDate: z
            .string()
            .refine((date) => !isNaN(Date.parse(date)), {
                message: "Fecha de fin inválida",
            })
            .optional(),
        workshop: z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "ID de workshop inválido")
            .optional(),
    }).refine((data) => {
        if (data.startDate && data.endDate) {
            const start = new Date(data.startDate);
            const end = new Date(data.endDate);
            return start <= end;
        }
        return true;
    }, {
        message: "La fecha de inicio debe ser anterior o igual a la fecha de fin",
        path: ["endDate"],
    }),
});
