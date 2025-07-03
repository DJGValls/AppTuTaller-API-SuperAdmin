import { z } from 'zod';
import { DayOfWeekEnum } from '../../enums/AppointmentStatus.enums';

export const workshopScheduleCreateSchema = z.object({
  body: z.object({
    workshopId: z.string().min(1, 'Workshop ID is required'),
    dayOfWeek: z.nativeEnum(DayOfWeekEnum, {
      errorMap: () => ({ message: 'Invalid day of week' }),
    }),
    startTime: z.string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:MM format'),
    endTime: z.string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:MM format'),
    slotDuration: z.number()
      .int('Slot duration must be an integer')
      .min(15, 'Slot duration must be at least 15 minutes')
      .max(480, 'Slot duration cannot exceed 8 hours'),
    breakBetweenSlots: z.number()
      .int('Break between slots must be an integer')
      .min(0, 'Break between slots cannot be negative')
      .max(120, 'Break between slots cannot exceed 2 hours')
      .optional()
      .default(0),
    isActive: z.boolean().optional().default(true),
    exceptions: z.array(z.object({
      date: z.string().datetime('Invalid date format'),
      reason: z.string().optional(),
      isBlocked: z.boolean().optional().default(true),
    })).optional().default([]),
  }).refine(
    (data) => {
      const startTime = data.startTime as string;
      const endTime = data.endTime as string;
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      const startMinutes = startHour * 60 + startMinute;
      const endMinutes = endHour * 60 + endMinute;
      return endMinutes > startMinutes;
    },
    {
      message: 'End time must be after start time',
      path: ['endTime'],
    }
  ),
});

export type WorkshopScheduleCreateInput = z.infer<typeof workshopScheduleCreateSchema>;
