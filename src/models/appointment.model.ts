import { Schema, model } from "mongoose";
import { Appointment } from "types/AppointmentTypes";
import { AppointmentStatusEnum, AppointmentPriorityEnum, ServiceTypeEnum } from "enums/AppointmentStatus.enums";

const vehicleInfoSchema = new Schema({
    make: {
        type: String,
        required: true,
        maxlength: [50, "Vehicle make cannot exceed 50 characters"]
    },
    model: {
        type: String,
        required: true,
        maxlength: [50, "Vehicle model cannot exceed 50 characters"]
    },
    year: {
        type: Number,
        required: true,
        min: [1900, "Year must be after 1900"],
        max: [new Date().getFullYear() + 1, "Year cannot be in the future"]
    },
    licensePlate: {
        type: String,
        required: true,
        maxlength: [20, "License plate cannot exceed 20 characters"],
        uppercase: true
    },
    vin: {
        type: String,
        maxlength: [17, "VIN cannot exceed 17 characters"],
        uppercase: true
    },
    color: {
        type: String,
        maxlength: [30, "Color cannot exceed 30 characters"]
    },
    mileage: {
        type: Number,
        min: [0, "Mileage cannot be negative"]
    },
    fuelType: {
        type: String,
        maxlength: [20, "Fuel type cannot exceed 20 characters"]
    }
}, { _id: false });

const emergencyContactSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: [100, "Emergency contact name cannot exceed 100 characters"]
    },
    phone: {
        type: String,
        required: true,
        maxlength: [20, "Emergency contact phone cannot exceed 20 characters"]
    },
    relationship: {
        type: String,
        required: true,
        maxlength: [50, "Relationship cannot exceed 50 characters"]
    }
}, { _id: false });

const appointmentSchema = new Schema<Appointment>(
    {
        appointmentNumber: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        client: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        workshop: {
            type: Schema.Types.ObjectId,
            ref: "Workshop",
            required: true,
            index: true
        },
        
        // Fecha y hora
        appointmentDate: {
            type: Date,
            required: true,
            index: true
        },
        startTime: {
            type: String,
            required: true,
            validate: {
                validator: function(v: string) {
                    return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
                },
                message: "Start time must be in HH:mm format"
            }
        },
        endTime: {
            type: String,
            required: true,
            validate: {
                validator: function(v: string) {
                    return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
                },
                message: "End time must be in HH:mm format"
            }
        },
        duration: {
            type: Number,
            required: true,
            min: [15, "Duration must be at least 15 minutes"],
            max: [480, "Duration cannot exceed 8 hours"]
        },
        
        // Información del servicio
        serviceType: {
            type: String,
            enum: Object.values(ServiceTypeEnum),
            required: true
        },
        title: {
            type: String,
            required: true,
            maxlength: [100, "Title cannot exceed 100 characters"]
        },
        description: {
            type: String,
            required: true,
            maxlength: [500, "Description cannot exceed 500 characters"]
        },
        priority: {
            type: String,
            enum: Object.values(AppointmentPriorityEnum),
            default: AppointmentPriorityEnum.MEDIUM
        },
        
        // Información del vehículo
        vehicleInfo: {
            type: vehicleInfoSchema,
            required: true
        },
        
        // Estado y gestión
        status: {
            type: String,
            enum: Object.values(AppointmentStatusEnum),
            default: AppointmentStatusEnum.PENDING,
            index: true
        },
        assignedEmployee: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        estimatedCost: {
            type: Number,
            min: [0, "Estimated cost cannot be negative"]
        },
        actualCost: {
            type: Number,
            min: [0, "Actual cost cannot be negative"]
        },
        
        // Información adicional
        clientNotes: {
            type: String,
            maxlength: [1000, "Client notes cannot exceed 1000 characters"]
        },
        internalNotes: {
            type: String,
            maxlength: [1000, "Internal notes cannot exceed 1000 characters"]
        },
        reparationOrder: {
            type: Schema.Types.ObjectId,
            ref: "ReparationOrder"
        },
        
        // Fechas de seguimiento
        confirmedAt: Date,
        startedAt: Date,
        completedAt: Date,
        cancelledAt: Date,
        cancellationReason: {
            type: String,
            maxlength: [200, "Cancellation reason cannot exceed 200 characters"]
        },
        
        // Información de contacto
        clientContact: {
            type: Schema.Types.ObjectId,
            ref: "Contact"
        },
        emergencyContact: emergencyContactSchema,
        
        // Recordatorios y notificaciones
        reminderSent: {
            type: Boolean,
            default: false
        },
        confirmationSent: {
            type: Boolean,
            default: false
        },
        
        // Metadata
        isActive: {
            type: Boolean,
            default: true
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Índices compuestos para optimizar consultas
appointmentSchema.index({ workshop: 1, appointmentDate: 1, startTime: 1 });
appointmentSchema.index({ client: 1, appointmentDate: 1 });
appointmentSchema.index({ assignedEmployee: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1, appointmentDate: 1 });
appointmentSchema.index({ workshop: 1, status: 1 });

// Validación para evitar conflictos de horario
appointmentSchema.index(
    { 
        workshop: 1, 
        appointmentDate: 1, 
        startTime: 1,
        status: 1 
    },
    { 
        unique: true,
        partialFilterExpression: { 
            status: { 
                $in: [
                    AppointmentStatusEnum.PENDING,
                    AppointmentStatusEnum.CONFIRMED,
                    AppointmentStatusEnum.IN_PROGRESS
                ]
            }
        }
    }
);

// Middleware para generar número de cita
appointmentSchema.pre('save', function() {
    if (this.isNew && !this.appointmentNumber) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        
        this.appointmentNumber = `APP-${year}${month}${day}-${random}`;
    }
});

// Validación personalizada para horarios
appointmentSchema.pre('save', function() {
    const timeToMinutes = (time: string): number => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };
    
    if (this.startTime && this.endTime) {
        const startMinutes = timeToMinutes(this.startTime);
        const endMinutes = timeToMinutes(this.endTime);
        
        if (endMinutes <= startMinutes) {
            throw new Error('End time must be after start time');
        }
        
        const calculatedDuration = endMinutes - startMinutes;
        if (Math.abs(this.duration - calculatedDuration) > 5) {
            this.duration = calculatedDuration;
        }
    }
});

export const AppointmentModel = model<Appointment>("Appointment", appointmentSchema);
