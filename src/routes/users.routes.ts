import { Router } from "express";
import { createUser, deleteUser, findUserById, findUsers, restoreUser, updateUser, subscribeWorkshop } from "controllers/users.controller";
import { userCreateSchema } from "schemas/users/userCreate.schema";
import { validate } from "middlewares/validate.middleware";
import { checkRoles } from "middlewares/roles.middleware";
import { getPermissions } from "middlewares/auth.middleware";
import { userUpdateSchema } from "schemas/users/userUpdate.schema";

const router = Router();

router.get("/", getPermissions, findUsers);

router.get("/:id", getPermissions, findUserById);

router.post("/", validate(userCreateSchema), getPermissions, checkRoles, createUser);

router.put("/:id", validate(userUpdateSchema), getPermissions, updateUser);

router.put("/:id/subscribe-workshop", getPermissions, subscribeWorkshop)

router.delete("/:id", getPermissions, deleteUser);

router.get("/:id/restore", getPermissions, restoreUser);


export default router;
