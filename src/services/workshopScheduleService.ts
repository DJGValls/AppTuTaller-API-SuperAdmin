import { WorkshopScheduleRepository } from "repositories/workshopScheduleRepositories";
import { WorkshopSchedule, InterfaceWorkshopScheduleService, InterfaceWorkshopScheduleRepository } from "types/ScheduleTypes";
import { DayOfWeekEnum } from "enums/AppointmentStatus.enums";

export class WorkshopScheduleService implements InterfaceWorkshopScheduleService {
    constructor(private workshopScheduleRepository: InterfaceWorkshopScheduleRepository) {}

    async createWorkshopSchedule(schedule: WorkshopSchedule): Promise<WorkshopSchedule> {
        return await this.workshopScheduleRepository.createWorkshopSchedule(schedule);
    }

    async findWorkshopSchedules(filter?: Record<string, any>, params?: any): Promise<WorkshopSchedule[]> {
        return await this.workshopScheduleRepository.findWorkshopSchedules(filter, params);
    }

    async findWorkshopScheduleById(id: string): Promise<WorkshopSchedule | null> {
        return await this.workshopScheduleRepository.findWorkshopScheduleById(id);
    }

    async findWorkshopSchedulesByWorkshop(workshopId: string): Promise<WorkshopSchedule[]> {
        return await this.workshopScheduleRepository.findWorkshopSchedulesByWorkshop(workshopId);
    }

    async updateWorkshopSchedule(id: string, schedule: Partial<WorkshopSchedule>): Promise<WorkshopSchedule | null> {
        return await this.workshopScheduleRepository.updateWorkshopSchedule(id, schedule);
    }

    async deleteWorkshopSchedule(id: string): Promise<WorkshopSchedule | null> {
        return await this.workshopScheduleRepository.deleteWorkshopSchedule(id);
    }

    async countWorkshopSchedules(filter?: Record<string, any>): Promise<number> {
        return await this.workshopScheduleRepository.countWorkshopSchedules(filter);
    }

    // Métodos específicos para horarios
    async getAvailableTimeSlots(workshopId: string, date: Date): Promise<string[]> {
        try {
            const dayOfWeek = this.getDayOfWeek(date);
            const schedules = await this.workshopScheduleRepository.findWorkshopSchedulesByWorkshop(workshopId);
            
            const daySchedule = schedules.find(schedule => 
                schedule.dayOfWeek === dayOfWeek && schedule.isOpen
            );

            if (!daySchedule) {
                return [];
            }

            return this.generateTimeSlots(daySchedule);
        } catch (error: any) {
            throw new Error(`Error getting available time slots: ${error.message}`);
        }
    }

    async isWorkshopOpenOnDate(workshopId: string, date: Date): Promise<boolean> {
        try {
            const dayOfWeek = this.getDayOfWeek(date);
            const schedules = await this.workshopScheduleRepository.findWorkshopSchedulesByWorkshop(workshopId);
            
            const daySchedule = schedules.find(schedule => schedule.dayOfWeek === dayOfWeek);
            return daySchedule ? daySchedule.isOpen : false;
        } catch (error: any) {
            throw new Error(`Error checking if workshop is open: ${error.message}`);
        }
    }

    async getWorkshopHoursForDate(workshopId: string, date: Date): Promise<{openTime: string, closeTime: string} | null> {
        try {
            const dayOfWeek = this.getDayOfWeek(date);
            const schedules = await this.workshopScheduleRepository.findWorkshopSchedulesByWorkshop(workshopId);
            
            const daySchedule = schedules.find(schedule => 
                schedule.dayOfWeek === dayOfWeek && schedule.isOpen
            );

            if (!daySchedule) {
                return null;
            }

            return {
                openTime: daySchedule.openTime,
                closeTime: daySchedule.closeTime
            };
        } catch (error: any) {
            throw new Error(`Error getting workshop hours: ${error.message}`);
        }
    }

    // Métodos helper privados
    private getDayOfWeek(date: Date): DayOfWeekEnum {
        const dayNames = [
            DayOfWeekEnum.SUNDAY,
            DayOfWeekEnum.MONDAY,
            DayOfWeekEnum.TUESDAY,
            DayOfWeekEnum.WEDNESDAY,
            DayOfWeekEnum.THURSDAY,
            DayOfWeekEnum.FRIDAY,
            DayOfWeekEnum.SATURDAY
        ];
        return dayNames[date.getDay()];
    }

    private generateTimeSlots(schedule: WorkshopSchedule): string[] {
        const slots: string[] = [];
        const openMinutes = this.timeToMinutes(schedule.openTime);
        const closeMinutes = this.timeToMinutes(schedule.closeTime);
        const slotDuration = schedule.slotDurationMinutes;

        let currentMinutes = openMinutes;

        while (currentMinutes + slotDuration <= closeMinutes) {
            // Verificar si no está en horario de break
            if (schedule.breakStartTime && schedule.breakEndTime) {
                const breakStartMinutes = this.timeToMinutes(schedule.breakStartTime);
                const breakEndMinutes = this.timeToMinutes(schedule.breakEndTime);
                
                if (currentMinutes >= breakStartMinutes && currentMinutes < breakEndMinutes) {
                    currentMinutes = breakEndMinutes;
                    continue;
                }
            }

            slots.push(this.minutesToTime(currentMinutes));
            currentMinutes += slotDuration;
        }

        return slots;
    }

    private timeToMinutes(time: string): number {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    private minutesToTime(minutes: number): string {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }
}
