import { z } from 'zod';
import { DayOfWeekEnum } from '../../enums/AppointmentStatus.enums';

export const workshopScheduleUpdateSchema = z.object({
  params: z.object({
    scheduleId: z.string().min(1, 'Schedule ID is required'),
  }),
  body: z.object({
    dayOfWeek: z.nativeEnum(DayOfWeekEnum, {
      errorMap: () => ({ message: 'Invalid day of week' }),
    }).optional(),
    startTime: z.string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:MM format')
      .optional(),
    endTime: z.string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:MM format')
      .optional(),
    slotDuration: z.number()
      .int('Slot duration must be an integer')
      .min(15, 'Slot duration must be at least 15 minutes')
      .max(480, 'Slot duration cannot exceed 8 hours')
      .optional(),
    breakBetweenSlots: z.number()
      .int('Break between slots must be an integer')
      .min(0, 'Break between slots cannot be negative')
      .max(120, 'Break between slots cannot exceed 2 hours')
      .optional(),
    isActive: z.boolean().optional(),
    exceptions: z.array(z.object({
      date: z.string().datetime('Invalid date format'),
      reason: z.string().optional(),
      isBlocked: z.boolean().optional().default(true),
    })).optional(),
  }).refine(
    (data) => {
      // Only validate time relationship if both times are provided
      if (data.startTime && data.endTime) {
        const startTime = data.startTime as string;
        const endTime = data.endTime as string;
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        const startMinutes = startHour * 60 + startMinute;
        const endMinutes = endHour * 60 + endMinute;
        return endMinutes > startMinutes;
      }
      return true;
    },
    {
      message: 'End time must be after start time',
      path: ['endTime'],
    }
  ),
});

export type WorkshopScheduleUpdateInput = z.infer<typeof workshopScheduleUpdateSchema>;
