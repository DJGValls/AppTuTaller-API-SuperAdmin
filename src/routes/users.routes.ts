import { Router } from "express";
import { createUser, deleteUser, findUserById, findUsers, updateUser } from "controllers/users.controller";
import { userSchema } from "schemas/user.schema";
import { validate } from "middlewares/validate.middleware";
import { checkRoles } from "middlewares/roles.middleware";
import { getPermissions } from "middlewares/auth.middleware";
import { paginationMiddleware } from "middlewares/pagination.middleware";

const router = Router();

router.get('/', getPermissions, paginationMiddleware, findUsers);

router.get('/:id', getPermissions, findUserById);

router.post('/', validate(userSchema), getPermissions, checkRoles, createUser);

router.put('/:id', getPermissions, getPermissions, updateUser);

router.delete('/:id', getPermissions, deleteUser);

export default router;
