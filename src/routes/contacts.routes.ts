import { Router } from "express";
import { validate } from "middlewares/validate.middleware";
import { checkRoles } from "middlewares/roles.middleware";
import { requirePermissions } from "middlewares/permissions.middleware";
import { getPermissions } from "middlewares/auth.middleware";
import {
    createContact,
    deleteContact,
    findContactById,
    findContacts,
    restoreContact,
    updateContact,
} from "controllers/contacts.controller";
import { contactCreateSchema } from "schemas/contacts/contactCreate.schema";
import { contactUpdateSchema } from "schemas/contacts/contactUpdate.schema";
import { UserPermissionsEnum } from "enums/UserPermissions.enums";

const router = Router();

// Solo admins y empleados pueden ver contactos
router.get("/", getPermissions, requirePermissions([UserPermissionsEnum.CONTACTS_READ]), findContacts);

router.get("/:id", getPermissions, requirePermissions([UserPermissionsEnum.CONTACTS_READ]), findContactById);

// Solo admins pueden crear contactos
router.post("/", validate(contactCreateSchema), getPermissions, requirePermissions([UserPermissionsEnum.CONTACTS_CREATE]), createContact);

// Admins y empleados pueden actualizar contactos
router.put("/:id", validate(contactUpdateSchema), getPermissions, requirePermissions([UserPermissionsEnum.CONTACTS_UPDATE]), updateContact);

// Solo admins pueden eliminar contactos
router.delete("/:id", getPermissions, requirePermissions([UserPermissionsEnum.CONTACTS_DELETE]), deleteContact);

// Solo admins pueden restaurar contactos
router.get("/:id/restore", getPermissions, requirePermissions([UserPermissionsEnum.CONTACTS_UPDATE]), restoreContact);

export default router;
