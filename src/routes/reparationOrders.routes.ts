import { Router } from "express";
import { checkRoles } from "middlewares/roles.middleware";
import { getPermissions } from "middlewares/auth.middleware";
import { validate } from "middlewares/validate.middleware";
import { reparationOrderCreateSchema } from "schemas/reparationOrders/reparationOrderCreate.schema";
import { reparationOrderUpdateSchema } from "schemas/reparationOrders/reparationOrderUpdate.schema";
import {
    createReparationOrder,
    deleteReparationOrder,
    findReparationOrderById,
    findReparationOrders,
    restoreReparationOrder,
    updateReparationOrder,
} from "controllers/reparationOrders.controller";

const router = Router();

router.get("/", getPermissions, findReparationOrders);

router.get("/:id", getPermissions, findReparationOrderById);

router.post("/", validate(reparationOrderCreateSchema), getPermissions, checkRoles, createReparationOrder);

router.put("/:id", validate(reparationOrderUpdateSchema), getPermissions, updateReparationOrder);

router.delete("/:id", getPermissions, deleteReparationOrder);

router.get("/:id/restore", getPermissions, restoreReparationOrder);

export default router;
