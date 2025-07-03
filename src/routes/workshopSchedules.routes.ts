import { Router } from "express";
import {
    findWorkshopSchedules,
    findWorkshopScheduleById,
    findWorkshopSchedulesByWorkshop,
    createWorkshopSchedule,
    updateWorkshopSchedule,
    deleteWorkshopSchedule,
    getWorkshopAvailability,
    createWeeklySchedule
} from "controllers/workshopSchedules.controller";
import { getPermissions } from "middlewares/auth.middleware";
import { requirePermissions } from "middlewares/permissions.middleware";
import { validate } from "middlewares/validate.middleware";
import { UserPermissionsEnum } from "enums/UserPermissions.enums";
import {
    workshopScheduleCreateSchema,
    workshopScheduleUpdateSchema,
    workshopScheduleQuerySchema,
    workshopScheduleAvailabilitySchema,
    workshopScheduleWeeklySchema
} from "schemas/workshopSchedules";

const router = Router();

// Rutas para horarios de talleres - Solo lectura para empleados, CRUD para admins
router.get("/", 
    getPermissions, 
    requirePermissions([UserPermissionsEnum.WORKSHOP_SCHEDULES_READ]), 
    validate(workshopScheduleQuerySchema),
    findWorkshopSchedules
);

router.get("/:id", 
    getPermissions, 
    requirePermissions([UserPermissionsEnum.WORKSHOP_SCHEDULES_READ]), 
    findWorkshopScheduleById
);

// Solo admins de taller pueden crear/editar/eliminar horarios
router.post("/", 
    getPermissions, 
    requirePermissions([UserPermissionsEnum.WORKSHOP_SCHEDULES_CREATE]), 
    validate(workshopScheduleCreateSchema),
    createWorkshopSchedule
);

router.put("/:id", 
    getPermissions, 
    requirePermissions([UserPermissionsEnum.WORKSHOP_SCHEDULES_UPDATE]), 
    validate(workshopScheduleUpdateSchema),
    updateWorkshopSchedule
);

router.delete("/:id", 
    getPermissions, 
    requirePermissions([UserPermissionsEnum.WORKSHOP_SCHEDULES_DELETE]), 
    deleteWorkshopSchedule
);

// Rutas específicas de talleres
router.get("/workshops/:workshopId", 
    getPermissions, 
    requirePermissions([UserPermissionsEnum.WORKSHOP_SCHEDULES_READ]), 
    validate(workshopScheduleQuerySchema),
    findWorkshopSchedulesByWorkshop
);

// Crear horario semanal completo - Solo admins de taller
router.post("/workshops/:workshopId/weekly", 
    getPermissions, 
    requirePermissions([UserPermissionsEnum.WORKSHOP_SCHEDULES_CREATE]), 
    validate(workshopScheduleWeeklySchema),
    createWeeklySchedule
);

// Rutas para obtener disponibilidad - Todos pueden consultar
router.get("/workshops/:workshopId/availability/:date", 
    getPermissions, 
    requirePermissions([UserPermissionsEnum.APPOINTMENTS_VIEW_AVAILABILITY]), 
    validate(workshopScheduleAvailabilitySchema),
    getWorkshopAvailability
);

export default router;
