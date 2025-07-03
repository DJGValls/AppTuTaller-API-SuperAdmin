export enum AppointmentStatusEnum {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED", 
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    NO_SHOW = "NO_SHOW",
    RESCHEDULED = "RESCHEDULED"
}

export enum DayOfWeekEnum {
    MONDAY = "MONDAY",
    TUESDAY = "TUESDAY", 
    WEDNESDAY = "WEDNESDAY",
    THURSDAY = "THURSDAY",
    FRIDAY = "FRIDAY",
    SATURDAY = "SATURDAY",
    SUNDAY = "SUNDAY"
}

export enum AppointmentPriorityEnum {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    URGENT = "URGENT"
}

export enum ServiceTypeEnum {
    BASIC_MAINTENANCE = "BASIC_MAINTENANCE", // 30-60 min
    DIAGNOSTIC = "DIAGNOSTIC", // 60-90 min
    MAJOR_REPAIR = "MAJOR_REPAIR", // 2-4 hours
    FULL_SERVICE = "FULL_SERVICE", // 4-8 hours
    EMERGENCY = "EMERGENCY", // Variable
    CONSULTATION = "CONSULTATION" // 15-30 min
}

export const SERVICE_DURATION_MINUTES: Record<ServiceTypeEnum, number> = {
    [ServiceTypeEnum.CONSULTATION]: 30,
    [ServiceTypeEnum.BASIC_MAINTENANCE]: 60,
    [ServiceTypeEnum.DIAGNOSTIC]: 90,
    [ServiceTypeEnum.MAJOR_REPAIR]: 240,
    [ServiceTypeEnum.FULL_SERVICE]: 480,
    [ServiceTypeEnum.EMERGENCY]: 120
};
