import { Router } from "express";
import { checkRoles } from "middlewares/roles.middleware";
import { requirePermissions } from "middlewares/permissions.middleware";
import { getPermissions } from "middlewares/auth.middleware";
import { validate } from "middlewares/validate.middleware";
import { reparationTaskCreateSchema } from "schemas/reparationTasks/reparationTaskCreate.schema";
import { reparationTaskUpdateSchema } from "schemas/reparationTasks/reparationTaskUpdate.schema";
import { 
    createReparationTask, 
    deleteReparationTask, 
    findReparationTaskById, 
    findReparationTasks, 
    restoreReparationTask, 
    updateReparationTask 
} from "controllers/reparationTasks.controller";
import { UserPermissionsEnum } from "enums/UserPermissions.enums";

const router = Router();

// Admins y empleados pueden ver tareas, clientes pueden ver las de sus órdenes
router.get('/', getPermissions, requirePermissions([UserPermissionsEnum.REPARATION_TASKS_READ]), findReparationTasks);

router.get('/:id', getPermissions, requirePermissions([UserPermissionsEnum.REPARATION_TASKS_READ]), findReparationTaskById);

// Solo admins y empleados pueden crear tareas
router.post('/', validate(reparationTaskCreateSchema), getPermissions, requirePermissions([UserPermissionsEnum.REPARATION_TASKS_CREATE]), createReparationTask);

// Solo admins y empleados pueden actualizar tareas
router.put('/:id', validate(reparationTaskUpdateSchema), getPermissions, requirePermissions([UserPermissionsEnum.REPARATION_TASKS_UPDATE]), updateReparationTask);

// Solo admins pueden eliminar tareas
router.delete('/:id', getPermissions, requirePermissions([UserPermissionsEnum.REPARATION_TASKS_DELETE]), deleteReparationTask);

// Solo admins pueden restaurar tareas
router.get('/:id/restore', getPermissions, requirePermissions([UserPermissionsEnum.REPARATION_TASKS_UPDATE]), restoreReparationTask);

export default router;
