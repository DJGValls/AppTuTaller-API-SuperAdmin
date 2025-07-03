import { Schema, model } from "mongoose";
import { WorkshopSchedule } from "types/ScheduleTypes";
import { DayOfWeekEnum } from "enums/AppointmentStatus.enums";

const workshopScheduleSchema = new Schema<WorkshopSchedule>(
    {
        workshop: {
            type: Schema.Types.ObjectId,
            ref: "Workshop",
            required: true,
            index: true
        },
        dayOfWeek: {
            type: String,
            enum: Object.values(DayOfWeekEnum),
            required: true
        },
        openTime: {
            type: String,
            required: true,
            validate: {
                validator: function(v: string) {
                    return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
                },
                message: "Open time must be in HH:mm format"
            }
        },
        closeTime: {
            type: String,
            required: true,
            validate: {
                validator: function(v: string) {
                    return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
                },
                message: "Close time must be in HH:mm format"
            }
        },
        isOpen: {
            type: Boolean,
            default: true
        },
        breakStartTime: {
            type: String,
            validate: {
                validator: function(v: string) {
                    return !v || /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
                },
                message: "Break start time must be in HH:mm format"
            }
        },
        breakEndTime: {
            type: String,
            validate: {
                validator: function(v: string) {
                    return !v || /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
                },
                message: "Break end time must be in HH:mm format"
            }
        },
        slotDurationMinutes: {
            type: Number,
            required: true,
            min: [15, "Slot duration must be at least 15 minutes"],
            max: [480, "Slot duration cannot exceed 8 hours"],
            default: 60
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Índices compuestos para optimizar consultas
workshopScheduleSchema.index({ workshop: 1, dayOfWeek: 1 }, { unique: true });
workshopScheduleSchema.index({ workshop: 1, isActive: 1 });

// Validación personalizada para asegurar que closeTime > openTime
workshopScheduleSchema.pre('save', function() {
    const timeToMinutes = (time: string): number => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    if (this.openTime && this.closeTime) {
        const openMinutes = timeToMinutes(this.openTime);
        const closeMinutes = timeToMinutes(this.closeTime);
        
        if (closeMinutes <= openMinutes) {
            throw new Error('Close time must be after open time');
        }
    }
    
    // Validar horario de break si existe
    if (this.breakStartTime && this.breakEndTime) {
        const breakStartMinutes = timeToMinutes(this.breakStartTime);
        const breakEndMinutes = timeToMinutes(this.breakEndTime);
        const openMinutes = timeToMinutes(this.openTime);
        const closeMinutes = timeToMinutes(this.closeTime);
        
        if (breakEndMinutes <= breakStartMinutes) {
            throw new Error('Break end time must be after break start time');
        }
        
        if (breakStartMinutes < openMinutes || breakEndMinutes > closeMinutes) {
            throw new Error('Break time must be within operating hours');
        }
    }
});

// Método helper para convertir tiempo a minutos
workshopScheduleSchema.methods.timeToMinutes = function(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

export const WorkshopScheduleModel = model<WorkshopSchedule>("WorkshopSchedule", workshopScheduleSchema);
