import { AppointmentRepository } from "repositories/appointmentRepositories";
import { WorkshopScheduleService } from "services/workshopScheduleService";
import { ReparationOrderService } from "services/reparationOrderService";
import { Appointment, InterfaceAppointmentService, InterfaceAppointmentRepository } from "types/AppointmentTypes";
import { ReparationOrder } from "types/ReparationOrderTypes";
import { AppointmentStatusEnum, ServiceTypeEnum, SERVICE_DURATION_MINUTES } from "enums/AppointmentStatus.enums";

export class AppointmentService implements InterfaceAppointmentService {
    constructor(
        private appointmentRepository: InterfaceAppointmentRepository,
        private workshopScheduleService: WorkshopScheduleService,
        private reparationOrderService?: ReparationOrderService
    ) {}

    async createAppointment(appointment: Appointment): Promise<Appointment> {
        // Generar número de cita si no existe
        if (!appointment.appointmentNumber) {
            appointment.appointmentNumber = await this.generateAppointmentNumber();
        }

        // Validar disponibilidad
        const workshopId = typeof appointment.workshop === 'string' 
            ? appointment.workshop 
            : appointment.workshop.toString();
            
        const isAvailable = await this.checkAvailability(
            workshopId,
            appointment.appointmentDate,
            appointment.startTime,
            appointment.duration
        );

        if (!isAvailable) {
            throw new Error('The selected time slot is not available');
        }

        return await this.appointmentRepository.createAppointment(appointment);
    }

    async findAppointments(filter?: Record<string, any>, params?: any): Promise<Appointment[]> {
        return await this.appointmentRepository.findAppointments(filter, params);
    }

    async findAppointmentById(id: string): Promise<Appointment | null> {
        return await this.appointmentRepository.findAppointmentById(id);
    }

    async findAppointmentByNumber(appointmentNumber: string): Promise<Appointment | null> {
        return await this.appointmentRepository.findAppointmentByNumber(appointmentNumber);
    }

    async findAppointmentsByWorkshop(workshopId: string, params?: any): Promise<Appointment[]> {
        return await this.appointmentRepository.findAppointmentsByWorkshop(workshopId, params);
    }

    async findAppointmentsByClient(clientId: string, params?: any): Promise<Appointment[]> {
        return await this.appointmentRepository.findAppointmentsByClient(clientId, params);
    }

    async findAppointmentsByDateRange(workshopId: string, startDate: Date, endDate: Date): Promise<Appointment[]> {
        return await this.appointmentRepository.findAppointmentsByDateRange(workshopId, startDate, endDate);
    }

    async findAppointmentsByEmployee(employeeId: string, params?: any): Promise<Appointment[]> {
        return await this.appointmentRepository.findAppointmentsByEmployee(employeeId, params);
    }

    async updateAppointment(id: string, appointment: Partial<Appointment>): Promise<Appointment | null> {
        return await this.appointmentRepository.updateAppointment(id, appointment);
    }

    async deleteAppointment(id: string): Promise<Appointment | null> {
        return await this.appointmentRepository.deleteAppointment(id);
    }

    async countAppointments(filter?: Record<string, any>): Promise<number> {
        return await this.appointmentRepository.countAppointments(filter);
    }

    // Métodos específicos para citas
    async generateAppointmentNumber(): Promise<string> {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        
        let attempts = 0;
        let appointmentNumber: string;
        
        do {
            const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            appointmentNumber = `APP-${year}${month}${day}-${random}`;
            attempts++;
            
            if (attempts > 100) {
                throw new Error('Unable to generate unique appointment number');
            }
        } while (await this.findAppointmentByNumber(appointmentNumber));
        
        return appointmentNumber;
    }

    async checkAvailability(workshopId: string, date: Date, startTime: string, duration: number): Promise<boolean> {
        try {
            // Verificar si el taller está abierto
            const isOpen = await this.workshopScheduleService.isWorkshopOpenOnDate(workshopId, date);
            if (!isOpen) {
                return false;
            }

            // Verificar si el horario está dentro del horario de operación
            const workshopHours = await this.workshopScheduleService.getWorkshopHoursForDate(workshopId, date);
            if (!workshopHours) {
                return false;
            }

            const startMinutes = this.timeToMinutes(startTime);
            const endMinutes = startMinutes + duration;
            const openMinutes = this.timeToMinutes(workshopHours.openTime);
            const closeMinutes = this.timeToMinutes(workshopHours.closeTime);

            if (startMinutes < openMinutes || endMinutes > closeMinutes) {
                return false;
            }

            // Verificar conflictos con otras citas
            const endTime = this.minutesToTime(endMinutes);
            const existingAppointments = await this.findAppointmentsByDateRange(
                workshopId,
                new Date(date.setHours(0, 0, 0, 0)),
                new Date(date.setHours(23, 59, 59, 999))
            );

            const conflictingAppointments = existingAppointments.filter(appointment => {
                if (appointment.status === AppointmentStatusEnum.CANCELLED) {
                    return false;
                }

                const appointmentStart = this.timeToMinutes(appointment.startTime);
                const appointmentEnd = this.timeToMinutes(appointment.endTime);

                // Verificar solapamiento
                return (startMinutes < appointmentEnd && endMinutes > appointmentStart);
            });

            return conflictingAppointments.length === 0;
        } catch (error: any) {
            throw new Error(`Error checking availability: ${error.message}`);
        }
    }

    async getAvailableSlots(workshopId: string, date: Date, serviceType: ServiceTypeEnum): Promise<string[]> {
        try {
            const serviceDuration = SERVICE_DURATION_MINUTES[serviceType];
            const allSlots = await this.workshopScheduleService.getAvailableTimeSlots(workshopId, date);
            const availableSlots: string[] = [];

            for (const slot of allSlots) {
                const isAvailable = await this.checkAvailability(workshopId, date, slot, serviceDuration);
                if (isAvailable) {
                    availableSlots.push(slot);
                }
            }

            return availableSlots;
        } catch (error: any) {
            throw new Error(`Error getting available slots: ${error.message}`);
        }
    }

    async confirmAppointment(appointmentId: string, employeeId?: string): Promise<Appointment | null> {
        const updateData: Partial<Appointment> = {
            status: AppointmentStatusEnum.CONFIRMED,
            confirmedAt: new Date(),
            confirmationSent: true
        };

        if (employeeId) {
            updateData.assignedEmployee = employeeId as any;
        }

        return await this.updateAppointment(appointmentId, updateData);
    }

    async cancelAppointment(appointmentId: string, reason: string): Promise<Appointment | null> {
        return await this.updateAppointment(appointmentId, {
            status: AppointmentStatusEnum.CANCELLED,
            cancelledAt: new Date(),
            cancellationReason: reason
        });
    }

    async rescheduleAppointment(appointmentId: string, newDate: Date, newStartTime: string): Promise<Appointment | null> {
        const appointment = await this.findAppointmentById(appointmentId);
        if (!appointment) {
            throw new Error('Appointment not found');
        }

        // Verificar disponibilidad en la nueva fecha/hora
        const workshopId = typeof appointment.workshop === 'string' 
            ? appointment.workshop 
            : appointment.workshop.toString();
            
        const isAvailable = await this.checkAvailability(
            workshopId,
            newDate,
            newStartTime,
            appointment.duration
        );

        if (!isAvailable) {
            throw new Error('The new time slot is not available');
        }

        const endMinutes = this.timeToMinutes(newStartTime) + appointment.duration;
        const newEndTime = this.minutesToTime(endMinutes);

        return await this.updateAppointment(appointmentId, {
            appointmentDate: newDate,
            startTime: newStartTime,
            endTime: newEndTime,
            status: AppointmentStatusEnum.RESCHEDULED
        });
    }

    async startAppointment(appointmentId: string): Promise<Appointment | null> {
        return await this.updateAppointment(appointmentId, {
            status: AppointmentStatusEnum.IN_PROGRESS,
            startedAt: new Date()
        });
    }

    async completeAppointment(appointmentId: string, actualCost?: number, notes?: string): Promise<Appointment | null> {
        const updateData: Partial<Appointment> = {
            status: AppointmentStatusEnum.COMPLETED,
            completedAt: new Date()
        };

        if (actualCost !== undefined) {
            updateData.actualCost = actualCost;
        }

        if (notes) {
            updateData.internalNotes = notes;
        }

        return await this.updateAppointment(appointmentId, updateData);
    }

    async createReparationOrderFromAppointment(appointmentId: string): Promise<ReparationOrder> {
        if (!this.reparationOrderService) {
            throw new Error('ReparationOrderService not available');
        }

        const appointment = await this.findAppointmentById(appointmentId);
        if (!appointment) {
            throw new Error('Appointment not found');
        }

        const reparationOrder = await this.reparationOrderService.createReparationOrder({
            name: `Orden de Reparación - ${appointment.title}`,
            description: appointment.description,
            workshop: appointment.workshop,
            // Otros campos según tu modelo de ReparationOrder
        } as ReparationOrder);

        // Actualizar la cita con la orden de reparación
        await this.updateAppointment(appointmentId, {
            reparationOrder: reparationOrder._id as any
        });

        return reparationOrder;
    }

    // Métodos helper privados
    private timeToMinutes(time: string): number {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    private minutesToTime(minutes: number): string {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }

    private addMinutesToTime(time: string, minutes: number): string {
        const timeInMinutes = this.timeToMinutes(time);
        const newTimeInMinutes = timeInMinutes + minutes;
        return this.minutesToTime(newTimeInMinutes);
    }

    private getDayOfWeek(date: Date): string {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        return days[date.getDay()];
    }

    private getDayOfWeekFromDate(date: Date): string {
        return this.getDayOfWeek(date);
    }

    // Nuevos métodos para calendario y múltiples fechas
    async getMonthlyAvailability(
        workshopId: string,
        year: number,
        month: number,
        serviceType: ServiceTypeEnum
    ): Promise<{ date: string; hasAvailability: boolean; availableSlots: number }[]> {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0); // Último día del mes
        
        const calendar = [];
        
        for (let day = 1; day <= endDate.getDate(); day++) {
            const currentDate = new Date(year, month - 1, day);
            
            try {
                const availableSlots = await this.getAvailableSlots(workshopId, currentDate, serviceType);
                calendar.push({
                    date: currentDate.toISOString().split('T')[0], // YYYY-MM-DD
                    hasAvailability: availableSlots.length > 0,
                    availableSlots: availableSlots.length
                });
            } catch (error) {
                // Si hay error (ej: día cerrado), marcar como no disponible
                calendar.push({
                    date: currentDate.toISOString().split('T')[0],
                    hasAvailability: false,
                    availableSlots: 0
                });
            }
        }
        
        return calendar;
    }

    async checkMultipleDatesAvailability(
        workshopId: string,
        dates: Date[],
        serviceType: ServiceTypeEnum
    ): Promise<{ date: string; hasAvailability: boolean; availableSlots: { startTime: string; endTime: string }[] }[]> {
        const results = [];
        const serviceDuration = SERVICE_DURATION_MINUTES[serviceType];
        
        for (const date of dates) {
            try {
                const availableSlotTimes = await this.getAvailableSlots(workshopId, date, serviceType);
                const availableSlots = availableSlotTimes.map(startTime => ({
                    startTime,
                    endTime: this.addMinutesToTime(startTime, serviceDuration)
                }));
                
                results.push({
                    date: date.toISOString().split('T')[0],
                    hasAvailability: availableSlots.length > 0,
                    availableSlots
                });
            } catch (error) {
                results.push({
                    date: date.toISOString().split('T')[0],
                    hasAvailability: false,
                    availableSlots: []
                });
            }
        }
        
        return results;
    }

    async getWorkshopBusyDates(
        workshopId: string,
        startDate: Date,
        endDate: Date
    ): Promise<{ date: string; reason: string; appointmentCount: number }[]> {
        // Obtener todas las citas en el rango de fechas
        const appointments = await this.appointmentRepository.findAppointments({
            workshop: workshopId,
            appointmentDate: {
                $gte: startDate,
                $lte: endDate
            },
            status: {
                $in: [
                    AppointmentStatusEnum.PENDING,
                    AppointmentStatusEnum.CONFIRMED,
                    AppointmentStatusEnum.IN_PROGRESS
                ]
            }
        });

        // Agrupar por fecha
        const dateMap = new Map<string, number>();
        
        appointments.forEach(appointment => {
            const dateKey = appointment.appointmentDate.toISOString().split('T')[0];
            dateMap.set(dateKey, (dateMap.get(dateKey) || 0) + 1);
        });

        // Obtener horarios del taller para determinar capacidad máxima
        const busyDates = [];
        
        for (const [date, appointmentCount] of dateMap.entries()) {
            const currentDate = new Date(date);
            
            try {
                // Verificar si el taller está abierto ese día
                const schedules = await this.workshopScheduleService.findWorkshopSchedulesByWorkshop(workshopId);
                const dayOfWeek = this.getDayOfWeek(currentDate);
                const schedule = schedules.find(s => s.dayOfWeek === dayOfWeek && s.isActive);
                
                if (schedule) {
                    // Calcular capacidad máxima del día basado en slots disponibles
                    const workingMinutes = this.calculateWorkingMinutes(schedule);
                    const slotsPerDay = Math.floor(workingMinutes / schedule.slotDurationMinutes);
                    const maxAppointments = slotsPerDay;
                    
                    // Si las citas exceden el 80% de la capacidad, considerarlo "ocupado"
                    if (appointmentCount >= maxAppointments * 0.8) {
                        busyDates.push({
                            date,
                            reason: appointmentCount >= maxAppointments ? 'fully_booked' : 'mostly_booked',
                            appointmentCount
                        });
                    }
                }
            } catch (error) {
                // Si no hay horario, considerar el día como cerrado
                if (appointmentCount > 0) {
                    busyDates.push({
                        date,
                        reason: 'closed',
                        appointmentCount
                    });
                }
            }
        }

        // También incluir días que están cerrados por excepciones
        const current = new Date(startDate);
        while (current <= endDate) {
            const dateKey = current.toISOString().split('T')[0];
            
            try {
                const schedules = await this.workshopScheduleService.findWorkshopSchedulesByWorkshop(workshopId);
                const dayOfWeek = this.getDayOfWeekFromDate(current);
                const schedule = schedules.find(s => s.dayOfWeek === dayOfWeek && s.isActive);
                
                if (!schedule || !schedule.isActive) {
                    busyDates.push({
                        date: dateKey,
                        reason: 'closed',
                        appointmentCount: 0
                    });
                }
            } catch (error) {
                busyDates.push({
                    date: dateKey,
                    reason: 'closed',
                    appointmentCount: 0
                });
            }
            
            current.setDate(current.getDate() + 1);
        }

        return busyDates.sort((a, b) => a.date.localeCompare(b.date));
    }

    private calculateWorkingMinutes(schedule: any): number {
        const startMinutes = this.timeToMinutes(schedule.openTime);
        const endMinutes = this.timeToMinutes(schedule.closeTime);
        let workingMinutes = endMinutes - startMinutes;
        
        // Restar tiempo de almuerzo si existe
        if (schedule.breakStartTime && schedule.breakEndTime) {
            const lunchStart = this.timeToMinutes(schedule.breakStartTime);
            const lunchEnd = this.timeToMinutes(schedule.breakEndTime);
            workingMinutes -= (lunchEnd - lunchStart);
        }
        
        return workingMinutes;
    }
}
