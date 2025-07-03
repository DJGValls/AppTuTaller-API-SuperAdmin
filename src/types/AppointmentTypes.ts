import { Types } from "mongoose";
import { User } from "./UserTypes";
import { Workshop } from "./WorkshopTypes";
import { ReparationOrder } from "./ReparationOrderTypes";
import { Contact } from "./ContactTypes";
import { AppointmentStatusEnum, AppointmentPriorityEnum, ServiceTypeEnum } from "enums/AppointmentStatus.enums";

export interface VehicleInfo {
    make: string; // Marca
    model: string; // Modelo
    year: number;
    licensePlate: string; // Placa
    vin?: string; // Número de identificación vehicular
    color?: string;
    mileage?: number; // Kilometraje
    fuelType?: string; // Tipo de combustible
}

export interface Appointment {
    _id?: Types.ObjectId | string;
    
    // Información básica
    appointmentNumber: string; // Número único de cita (auto-generado)
    client: Types.ObjectId | User; // Cliente que reserva la cita
    workshop: Types.ObjectId | Workshop; // Taller donde se realizará el servicio
    
    // Fecha y hora
    appointmentDate: Date; // Fecha de la cita
    startTime: string; // Hora de inicio (formato HH:mm)
    endTime: string; // Hora estimada de finalización
    duration: number; // Duración en minutos
    
    // Información del servicio
    serviceType: ServiceTypeEnum;
    title: string; // Título corto del servicio
    description: string; // Descripción detallada del problema/servicio
    priority: AppointmentPriorityEnum;
    
    // Información del vehículo
    vehicleInfo: VehicleInfo;
    
    // Estado y gestión
    status: AppointmentStatusEnum;
    assignedEmployee?: Types.ObjectId | User; // Empleado asignado
    estimatedCost?: number;
    actualCost?: number;
    
    // Información adicional
    clientNotes?: string; // Notas del cliente
    internalNotes?: string; // Notas internas del taller
    reparationOrder?: Types.ObjectId | ReparationOrder; // Orden de reparación asociada (si se crea)
    
    // Fechas de seguimiento
    confirmedAt?: Date;
    startedAt?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
    cancellationReason?: string;
    
    // Información de contacto
    clientContact?: Types.ObjectId | Contact;
    emergencyContact?: {
        name: string;
        phone: string;
        relationship: string;
    };
    
    // Recordatorios y notificaciones
    reminderSent?: boolean;
    confirmationSent?: boolean;
    
    // Metadata
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: Types.ObjectId | User;
    updatedBy?: Types.ObjectId | User;
}

export interface AppointmentAvailability {
    workshopId: string;
    date: Date;
    availableSlots: string[]; // Array de horarios disponibles ["09:00", "10:30", etc.]
    unavailableSlots: string[]; // Array de horarios ocupados
    isWorkshopOpen: boolean;
    specialHours?: {
        openTime: string;
        closeTime: string;
        reason: string;
    };
}

export interface InterfaceAppointmentRepository {
    createAppointment(appointment: Appointment): Promise<Appointment>;
    findAppointments(filter?: Record<string, any>, params?: any): Promise<Appointment[]>;
    findAppointmentById(id: string): Promise<Appointment | null>;
    findAppointmentByNumber(appointmentNumber: string): Promise<Appointment | null>;
    findAppointmentsByWorkshop(workshopId: string, params?: any): Promise<Appointment[]>;
    findAppointmentsByClient(clientId: string, params?: any): Promise<Appointment[]>;
    findAppointmentsByDateRange(workshopId: string, startDate: Date, endDate: Date): Promise<Appointment[]>;
    findAppointmentsByEmployee(employeeId: string, params?: any): Promise<Appointment[]>;
    updateAppointment(id: string, appointment: Partial<Appointment>): Promise<Appointment | null>;
    deleteAppointment(id: string): Promise<Appointment | null>;
    countAppointments(filter?: Record<string, any>): Promise<number>;
}

export interface InterfaceAppointmentService {
    createAppointment(appointment: Appointment): Promise<Appointment>;
    findAppointments(filter?: Record<string, any>, params?: any): Promise<Appointment[]>;
    findAppointmentById(id: string): Promise<Appointment | null>;
    findAppointmentByNumber(appointmentNumber: string): Promise<Appointment | null>;
    findAppointmentsByWorkshop(workshopId: string, params?: any): Promise<Appointment[]>;
    findAppointmentsByClient(clientId: string, params?: any): Promise<Appointment[]>;
    findAppointmentsByDateRange(workshopId: string, startDate: Date, endDate: Date): Promise<Appointment[]>;
    findAppointmentsByEmployee(employeeId: string, params?: any): Promise<Appointment[]>;
    updateAppointment(id: string, appointment: Partial<Appointment>): Promise<Appointment | null>;
    deleteAppointment(id: string): Promise<Appointment | null>;
    countAppointments(filter?: Record<string, any>): Promise<number>;
    
    // Métodos específicos para citas
    generateAppointmentNumber(): Promise<string>;
    checkAvailability(workshopId: string, date: Date, startTime: string, duration: number): Promise<boolean>;
    getAvailableSlots(workshopId: string, date: Date, serviceType: ServiceTypeEnum): Promise<string[]>;
    confirmAppointment(appointmentId: string, employeeId?: string): Promise<Appointment | null>;
    cancelAppointment(appointmentId: string, reason: string): Promise<Appointment | null>;
    rescheduleAppointment(appointmentId: string, newDate: Date, newStartTime: string): Promise<Appointment | null>;
    startAppointment(appointmentId: string): Promise<Appointment | null>;
    completeAppointment(appointmentId: string, actualCost?: number, notes?: string): Promise<Appointment | null>;
    createReparationOrderFromAppointment(appointmentId: string): Promise<ReparationOrder>;
}
