import { Router } from "express";
import { findRoles, findRolesById, createRoles, updateRoles, deleteRoles } from "controllers/roles.controller";
import { validate } from "middlewares/validate.middleware";
import { rolesSchema } from "schemas/roles.schema";
import { requirePermissions } from "middlewares/permissions.middleware";
import { getPermissions } from "middlewares/auth.middleware";
import { UserPermissionsEnum } from "enums/UserPermissions.enums";

const router = Router();

// Solo admins pueden gestionar roles
router.get('/', getPermissions, requirePermissions([UserPermissionsEnum.ROLES_READ]), findRoles);

router.get('/:id', getPermissions, requirePermissions([UserPermissionsEnum.ROLES_READ]), findRolesById);

router.post('/', validate(rolesSchema), getPermissions, requirePermissions([UserPermissionsEnum.ROLES_CREATE]), createRoles);

router.put('/:id', validate(rolesSchema), getPermissions, requirePermissions([UserPermissionsEnum.ROLES_UPDATE]), updateRoles);

router.delete('/:id', getPermissions, requirePermissions([UserPermissionsEnum.ROLES_DELETE]), deleteRoles);

export default router;
