import { z } from 'zod';
import { DayOfWeekEnum } from '../../enums/AppointmentStatus.enums';

export const workshopScheduleQuerySchema = z.object({
  params: z.object({
    workshopId: z.string().min(1, 'Workshop ID is required'),
  }),
  query: z.object({
    dayOfWeek: z.nativeEnum(DayOfWeekEnum, {
      errorMap: () => ({ message: 'Invalid day of week' }),
    }).optional(),
    isActive: z.string()
      .optional()
      .transform((val) => val === 'true'),
    includeExceptions: z.string()
      .optional()
      .default('false')
      .transform((val) => val === 'true'),
  }),
});

export const workshopScheduleParamsSchema = z.object({
  params: z.object({
    scheduleId: z.string().min(1, 'Schedule ID is required'),
  }),
});

export const workshopScheduleAvailabilitySchema = z.object({
  params: z.object({
    workshopId: z.string().min(1, 'Workshop ID is required'),
  }),
  query: z.object({
    date: z.string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    serviceType: z.string().optional(),
    duration: z.string()
      .transform((val) => parseInt(val, 10))
      .pipe(z.number().int().min(15).max(480))
      .optional(),
  }),
});

export const workshopScheduleWeeklySchema = z.object({
  params: z.object({
    workshopId: z.string().min(1, 'Workshop ID is required'),
  }),
  query: z.object({
    startDate: z.string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format'),
    endDate: z.string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format')
      .optional(),
    includeAvailability: z.string()
      .optional()
      .default('true')
      .transform((val) => val === 'true'),
  }).refine(
    (data) => {
      if (data.endDate) {
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        return end >= start;
      }
      return true;
    },
    {
      message: 'End date must be after or equal to start date',
      path: ['endDate'],
    }
  ),
});

export const workshopScheduleExceptionSchema = z.object({
  params: z.object({
    scheduleId: z.string().min(1, 'Schedule ID is required'),
  }),
  body: z.object({
    date: z.string().datetime('Invalid date format'),
    reason: z.string().min(1, 'Reason is required'),
    isBlocked: z.boolean().optional().default(true),
  }),
});

export type WorkshopScheduleQueryInput = z.infer<typeof workshopScheduleQuerySchema>;
export type WorkshopScheduleParamsInput = z.infer<typeof workshopScheduleParamsSchema>;
export type WorkshopScheduleAvailabilityInput = z.infer<typeof workshopScheduleAvailabilitySchema>;
export type WorkshopScheduleWeeklyInput = z.infer<typeof workshopScheduleWeeklySchema>;
export type WorkshopScheduleExceptionInput = z.infer<typeof workshopScheduleExceptionSchema>;
