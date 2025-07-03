import { Router } from "express";
import { createUser, deleteUser, findUserById, findUsers, restoreUser, updateUser, subscribeWorkshop } from "controllers/users.controller";
import { userCreateSchema } from "schemas/users/userCreate.schema";
import { validate } from "middlewares/validate.middleware";
import { checkRoles } from "middlewares/roles.middleware";
import { requirePermissions } from "middlewares/permissions.middleware";
import { getPermissions } from "middlewares/auth.middleware";
import { userUpdateSchema } from "schemas/users/userUpdate.schema";
import { UserPermissionsEnum } from "enums/UserPermissions.enums";

const router = Router();

// Solo admins pueden ver todos los usuarios
router.get("/", getPermissions, requirePermissions([UserPermissionsEnum.USERS_READ]), findUsers);

// Usuarios pueden ver su propio perfil, admins pueden ver cualquiera
router.get("/:id", getPermissions, requirePermissions([UserPermissionsEnum.USERS_READ]), findUserById);

// Solo admins de taller pueden crear usuarios
router.post("/", validate(userCreateSchema), getPermissions, requirePermissions([UserPermissionsEnum.USERS_CREATE]), createUser);

// Usuarios pueden actualizar su perfil, admins pueden actualizar cualquiera
router.put("/:id", validate(userUpdateSchema), getPermissions, requirePermissions([UserPermissionsEnum.USERS_UPDATE]), updateUser);

// Solo admins pueden suscribir usuarios a talleres
router.put("/:id/subscribe-workshop", getPermissions, requirePermissions([UserPermissionsEnum.USERS_UPDATE]), subscribeWorkshop)

// Solo admins pueden eliminar usuarios
router.delete("/:id", getPermissions, requirePermissions([UserPermissionsEnum.USERS_DELETE]), deleteUser);

// Solo admins pueden restaurar usuarios
router.get("/:id/restore", getPermissions, requirePermissions([UserPermissionsEnum.USERS_UPDATE]), restoreUser);


export default router;
