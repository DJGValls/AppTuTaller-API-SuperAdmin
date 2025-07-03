import { Types } from "mongoose";
import { Workshop } from "./WorkshopTypes";
import { DayOfWeekEnum } from "enums/AppointmentStatus.enums";

export interface WorkshopSchedule {
    _id?: Types.ObjectId | string;
    workshop: Types.ObjectId | Workshop;
    dayOfWeek: DayOfWeekEnum;
    openTime: string; // formato HH:mm (ej: "08:00")
    closeTime: string; // formato HH:mm (ej: "18:00")
    isOpen: boolean;
    breakStartTime?: string; // horario de almuerzo inicio
    breakEndTime?: string; // horario de almuerzo fin
    slotDurationMinutes: number; // duración de cada slot (ej: 30, 60 minutos)
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ScheduleException {
    _id?: Types.ObjectId | string;
    workshop: Types.ObjectId | Workshop;
    date: Date;
    reason: string; // "Holiday", "Vacation", "Maintenance", etc.
    isRecurring: boolean; // para fechas que se repiten anualmente
    isClosed: boolean; // true = cerrado, false = horario especial
    specialOpenTime?: string; // horario especial si no está cerrado
    specialCloseTime?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface InterfaceWorkshopScheduleRepository {
    createWorkshopSchedule(schedule: WorkshopSchedule): Promise<WorkshopSchedule>;
    findWorkshopSchedules(filter?: Record<string, any>, params?: any): Promise<WorkshopSchedule[]>;
    findWorkshopScheduleById(id: string): Promise<WorkshopSchedule | null>;
    findWorkshopSchedulesByWorkshop(workshopId: string): Promise<WorkshopSchedule[]>;
    updateWorkshopSchedule(id: string, schedule: Partial<WorkshopSchedule>): Promise<WorkshopSchedule | null>;
    deleteWorkshopSchedule(id: string): Promise<WorkshopSchedule | null>;
    countWorkshopSchedules(filter?: Record<string, any>): Promise<number>;
}

export interface InterfaceScheduleExceptionRepository {
    createScheduleException(exception: ScheduleException): Promise<ScheduleException>;
    findScheduleExceptions(filter?: Record<string, any>, params?: any): Promise<ScheduleException[]>;
    findScheduleExceptionById(id: string): Promise<ScheduleException | null>;
    findExceptionsByWorkshopAndDateRange(workshopId: string, startDate: Date, endDate: Date): Promise<ScheduleException[]>;
    updateScheduleException(id: string, exception: Partial<ScheduleException>): Promise<ScheduleException | null>;
    deleteScheduleException(id: string): Promise<ScheduleException | null>;
    countScheduleExceptions(filter?: Record<string, any>): Promise<number>;
}

export interface InterfaceWorkshopScheduleService {
    createWorkshopSchedule(schedule: WorkshopSchedule): Promise<WorkshopSchedule>;
    findWorkshopSchedules(filter?: Record<string, any>, params?: any): Promise<WorkshopSchedule[]>;
    findWorkshopScheduleById(id: string): Promise<WorkshopSchedule | null>;
    findWorkshopSchedulesByWorkshop(workshopId: string): Promise<WorkshopSchedule[]>;
    updateWorkshopSchedule(id: string, schedule: Partial<WorkshopSchedule>): Promise<WorkshopSchedule | null>;
    deleteWorkshopSchedule(id: string): Promise<WorkshopSchedule | null>;
    countWorkshopSchedules(filter?: Record<string, any>): Promise<number>;
    
    // Métodos específicos para horarios
    getAvailableTimeSlots(workshopId: string, date: Date): Promise<string[]>;
    isWorkshopOpenOnDate(workshopId: string, date: Date): Promise<boolean>;
    getWorkshopHoursForDate(workshopId: string, date: Date): Promise<{openTime: string, closeTime: string} | null>;
}

export interface InterfaceScheduleExceptionService {
    createScheduleException(exception: ScheduleException): Promise<ScheduleException>;
    findScheduleExceptions(filter?: Record<string, any>, params?: any): Promise<ScheduleException[]>;
    findScheduleExceptionById(id: string): Promise<ScheduleException | null>;
    findExceptionsByWorkshopAndDateRange(workshopId: string, startDate: Date, endDate: Date): Promise<ScheduleException[]>;
    updateScheduleException(id: string, exception: Partial<ScheduleException>): Promise<ScheduleException | null>;
    deleteScheduleException(id: string): Promise<ScheduleException | null>;
    countScheduleExceptions(filter?: Record<string, any>): Promise<number>;
}
