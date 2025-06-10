import { Router } from "express";
import { validate } from "middlewares/validate.middleware";
import { checkRoles } from "middlewares/roles.middleware";
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

const router = Router();

router.get("/", getPermissions, findContacts);

router.get("/:id", getPermissions, findContactById);

router.post("/", validate(contactCreateSchema), getPermissions, checkRoles, createContact);

router.put("/:id", validate(contactUpdateSchema), getPermissions, updateContact);

router.delete("/:id", getPermissions, deleteContact);

router.get("/:id/restore", getPermissions, restoreContact);

export default router;
