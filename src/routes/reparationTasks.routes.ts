import { Router } from "express";
import { checkRoles } from "middlewares/roles.middleware";
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

const router = Router();

router.get('/', getPermissions, findReparationTasks);

router.get('/:id', getPermissions, findReparationTaskById);

router.post('/', validate(reparationTaskCreateSchema), getPermissions, checkRoles, createReparationTask);

router.put('/:id', validate(reparationTaskUpdateSchema), getPermissions, updateReparationTask);

router.delete('/:id', getPermissions, deleteReparationTask);

router.get('/:id/restore', getPermissions, restoreReparationTask);

export default router;
