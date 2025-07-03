import { Schema, model } from "mongoose";
import { ScheduleException } from "types/ScheduleTypes";

const scheduleExceptionSchema = new Schema<ScheduleException>(
    {
        workshop: {
            type: Schema.Types.ObjectId,
            ref: "Workshop",
            required: true,
            index: true
        },
        date: {
            type: Date,
            required: true,
            index: true
        },
        reason: {
            type: String,
            required: true,
            maxlength: [200, "Reason cannot exceed 200 characters"]
        },
        isRecurring: {
            type: Boolean,
            default: false
        },
        isClosed: {
            type: Boolean,
            default: true
        },
        specialOpenTime: {
            type: String,
            validate: {
                validator: function(v: string) {
                    return !v || /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
                },
                message: "Special open time must be in HH:mm format"
            }
        },
        specialCloseTime: {
            type: String,
            validate: {
                validator: function(v: string) {
                    return !v || /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
                },
                message: "Special close time must be in HH:mm format"
            }
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Índices para optimizar consultas
scheduleExceptionSchema.index({ workshop: 1, date: 1 });
scheduleExceptionSchema.index({ workshop: 1, isRecurring: 1 });

// Validación para horarios especiales
scheduleExceptionSchema.pre('save', function() {
    if (!this.isClosed && (!this.specialOpenTime || !this.specialCloseTime)) {
        throw new Error('Special open and close times are required when not closed');
    }
    
    if (this.specialOpenTime && this.specialCloseTime) {
        const timeToMinutes = (time: string): number => {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
        };
        
        const openMinutes = timeToMinutes(this.specialOpenTime);
        const closeMinutes = timeToMinutes(this.specialCloseTime);
        
        if (closeMinutes <= openMinutes) {
            throw new Error('Special close time must be after special open time');
        }
    }
});

export const ScheduleExceptionModel = model<ScheduleException>("ScheduleException", scheduleExceptionSchema);
