import { Router } from "express";
import { checkRoles } from "middlewares/roles.middleware";
import { requirePermissions } from "middlewares/permissions.middleware";
import { getPermissions } from "middlewares/auth.middleware";
import { createWorkshop, deleteWorkshop, findWorkshopById, findWorkshops, restoreWorkshop, updateWorkshop } from "controllers/workshop.controller";
import { validate } from "middlewares/validate.middleware";
import { workshopCreateSchema } from "schemas/workshops/workshopCreate.schema";
import { workshopUpdateSchema } from "schemas/workshops/workshopUpdate.schema";
import { UserPermissionsEnum } from "enums/UserPermissions.enums";

const router = Router();

// Todos pueden ver talleres
router.get('/', getPermissions, requirePermissions([UserPermissionsEnum.WORKSHOPS_READ]), findWorkshops);

router.get('/:id', getPermissions, requirePermissions([UserPermissionsEnum.WORKSHOPS_READ]), findWorkshopById);

// Solo super admins pueden crear talleres
router.post('/', validate(workshopCreateSchema), getPermissions, requirePermissions([UserPermissionsEnum.WORKSHOPS_CREATE]), createWorkshop);

// Solo admins de taller pueden actualizar sus talleres
router.put('/:id', validate(workshopUpdateSchema), getPermissions, requirePermissions([UserPermissionsEnum.WORKSHOPS_UPDATE]), updateWorkshop);

// Solo super admins pueden eliminar talleres
router.delete('/:id', getPermissions, requirePermissions([UserPermissionsEnum.WORKSHOPS_DELETE]), deleteWorkshop);

// Solo super admins pueden restaurar talleres
router.get('/:id/restore', getPermissions, requirePermissions([UserPermissionsEnum.WORKSHOPS_UPDATE]), restoreWorkshop);

export default router;
