import { Router } from "express";
import { checkRoles } from "middlewares/roles.middleware";
import { getPermissions } from "middlewares/auth.middleware";
import { createWorkshop, deleteWorkshop, findWorkshopById, findWorkshops, restoreWorkshop, updateWorkshop } from "controllers/workshop.controller";
import { validate } from "middlewares/validate.middleware";
import { workshopCreateSchema } from "schemas/workshops/workshopCreate.schema";
import { workshopUpdateSchema } from "schemas/workshops/workshopUpdate.schema";

const router = Router();

router.get('/', getPermissions, findWorkshops);

router.get('/:id', getPermissions, findWorkshopById);

router.post('/', validate(workshopCreateSchema), getPermissions, checkRoles, createWorkshop);

router.put('/:id', validate(workshopUpdateSchema), getPermissions, updateWorkshop);

router.delete('/:id', getPermissions, deleteWorkshop);

router.get('/:id/restore', getPermissions, restoreWorkshop);

export default router;
