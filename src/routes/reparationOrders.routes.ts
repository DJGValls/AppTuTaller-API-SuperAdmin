import { Router } from "express";
import { checkRoles } from "middlewares/roles.middleware";
import { requirePermissions } from "middlewares/permissions.middleware";
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
import { UserPermissionsEnum } from "enums/UserPermissions.enums";

const router = Router();

// Admins, empleados y clientes pueden ver órdenes (filtradas según su rol)
router.get("/", getPermissions, requirePermissions([UserPermissionsEnum.REPARATION_ORDERS_READ]), findReparationOrders);

router.get("/:id", getPermissions, requirePermissions([UserPermissionsEnum.REPARATION_ORDERS_READ]), findReparationOrderById);

// Solo admins de taller pueden crear órdenes
router.post("/", validate(reparationOrderCreateSchema), getPermissions, requirePermissions([UserPermissionsEnum.REPARATION_ORDERS_CREATE]), createReparationOrder);

// Admins y empleados pueden actualizar órdenes
router.put("/:id", validate(reparationOrderUpdateSchema), getPermissions, requirePermissions([UserPermissionsEnum.REPARATION_ORDERS_UPDATE]), updateReparationOrder);

// Solo admins pueden eliminar órdenes
router.delete("/:id", getPermissions, requirePermissions([UserPermissionsEnum.REPARATION_ORDERS_DELETE]), deleteReparationOrder);

// Solo admins pueden restaurar órdenes
router.get("/:id/restore", getPermissions, requirePermissions([UserPermissionsEnum.REPARATION_ORDERS_UPDATE]), restoreReparationOrder);

export default router;
