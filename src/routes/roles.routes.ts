import { Router } from "express";
import { findRoles, findRolesById, createRoles, updateRoles, deleteRoles } from "controllers/roles.controller";
import { validate } from "middlewares/validate.middleware";
import { rolesSchema } from "schemas/roles.schema";
import { getPermissions } from "middlewares/auth.middleware";

const router = Router();

router.get('/', getPermissions, findRoles);

router.get('/:id', getPermissions, findRolesById);

router.post('/', validate(rolesSchema), getPermissions, createRoles);

router.put('/:id', validate(rolesSchema), getPermissions, updateRoles);

router.delete('/:id', getPermissions, deleteRoles);

export default router;
