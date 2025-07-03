import { Router } from "express";
import {
    findAppointments,
    findAppointmentById,
    findAppointmentByNumber,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    confirmAppointment,
    cancelAppointment,
    rescheduleAppointment,
    getAvailableSlots,
    startAppointment,
    completeAppointment,
    createReparationOrderFromAppointment,
    getAvailabilityCalendar,
    checkMultipleDatesAvailability,
    getWorkshopBusyDates
} from "controllers/appointments.controller";
import { getPermissions } from "middlewares/auth.middleware";
import { checkRoles } from "middlewares/roles.middleware";
import { requirePermissions } from "middlewares/permissions.middleware";
import { validate } from "middlewares/validate.middleware";
import { UserPermissionsEnum } from "enums/UserPermissions.enums";
import { 
    appointmentCreateSchema,
    appointmentUpdateSchema,
    appointmentConfirmSchema,
    appointmentCancelSchema,
    appointmentRescheduleSchema,
    appointmentCompleteSchema,
    availableSlotsQuerySchema,
    calendarQuerySchema,
    checkMultipleDatesSchema,
    busyDatesQuerySchema
} from "schemas/appointments";

const router = Router();

// Rutas básicas CRUD
router.get("/", getPermissions, requirePermissions([UserPermissionsEnum.APPOINTMENTS_READ]), findAppointments);

router.get("/number/:appointmentNumber", getPermissions, requirePermissions([UserPermissionsEnum.APPOINTMENTS_READ]), findAppointmentByNumber);

router.get("/:id", getPermissions, requirePermissions([UserPermissionsEnum.APPOINTMENTS_READ]), findAppointmentById);

// Solo clientes pueden crear citas
router.post("/", getPermissions, requirePermissions([UserPermissionsEnum.APPOINTMENTS_CREATE]), createAppointment);

// Solo admins de taller pueden editar/eliminar citas
router.put("/:id", getPermissions, requirePermissions([UserPermissionsEnum.APPOINTMENTS_UPDATE]), updateAppointment);

router.delete("/:id", getPermissions, requirePermissions([UserPermissionsEnum.APPOINTMENTS_DELETE]), deleteAppointment);

// Rutas para gestión de citas - Solo admins de taller
router.put("/:id/confirm", getPermissions, requirePermissions([UserPermissionsEnum.APPOINTMENTS_MANAGE]), confirmAppointment);

router.put("/:id/cancel", getPermissions, requirePermissions([UserPermissionsEnum.APPOINTMENTS_UPDATE]), cancelAppointment);

router.put("/:id/reschedule", getPermissions, requirePermissions([UserPermissionsEnum.APPOINTMENTS_UPDATE]), rescheduleAppointment);

router.put("/:id/start", getPermissions, requirePermissions([UserPermissionsEnum.APPOINTMENTS_MANAGE]), startAppointment);

router.put("/:id/complete", getPermissions, requirePermissions([UserPermissionsEnum.APPOINTMENTS_MANAGE]), completeAppointment);

// Rutas para consultar disponibilidad - Todos pueden ver disponibilidad
router.get("/workshops/:workshopId/available-slots", getPermissions, requirePermissions([UserPermissionsEnum.APPOINTMENTS_VIEW_AVAILABILITY]), getAvailableSlots);

// Nuevas rutas para calendario y múltiples fechas - Todos pueden ver disponibilidad
router.get("/workshops/:workshopId/calendar", getPermissions, requirePermissions([UserPermissionsEnum.APPOINTMENTS_VIEW_AVAILABILITY]), getAvailabilityCalendar);

router.post("/workshops/:workshopId/check-dates", getPermissions, requirePermissions([UserPermissionsEnum.APPOINTMENTS_VIEW_AVAILABILITY]), checkMultipleDatesAvailability);

router.get("/workshops/:workshopId/busy-dates", getPermissions, requirePermissions([UserPermissionsEnum.APPOINTMENTS_VIEW_AVAILABILITY]), getWorkshopBusyDates);

// Crear orden de reparación desde cita - Solo admins de taller
router.post("/:id/create-reparation-order", getPermissions, requirePermissions([UserPermissionsEnum.REPARATION_ORDERS_CREATE]), createReparationOrderFromAppointment);

export default router;
