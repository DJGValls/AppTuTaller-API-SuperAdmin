import {
    createSubscription,
    deleteSubscription,
    findSubscriptionById,
    findSubscriptions,
    restoreSubscription,
    updateSubscription,
} from "controllers/subscriptions.controller";
import { Router } from "express";
import { getPermissions } from "middlewares/auth.middleware";
import { checkRoles } from "middlewares/roles.middleware";
import { requirePermissions } from "middlewares/permissions.middleware";
import { validate } from "middlewares/validate.middleware";
import { subscriptionCreateSchema } from "schemas/subscriptions/subscriptionCreate.schema";
import { subscriptionUpdateSchema } from "schemas/subscriptions/subscriptionUpdate.schema";
import { UserPermissionsEnum } from "enums/UserPermissions.enums";
import subscriptionDurationsRoutes from "./subscriptionDurations.routes";

const router = Router(); 

router.use("/durations", getPermissions, subscriptionDurationsRoutes);

// Solo super admins pueden gestionar suscripciones
router.get("/", getPermissions, requirePermissions([UserPermissionsEnum.SUBSCRIPTIONS_READ]), findSubscriptions);

router.get("/:id", getPermissions, requirePermissions([UserPermissionsEnum.SUBSCRIPTIONS_READ]), findSubscriptionById);

router.post("/", validate(subscriptionCreateSchema), getPermissions, requirePermissions([UserPermissionsEnum.SUBSCRIPTIONS_CREATE]), createSubscription);

router.put("/:id", validate(subscriptionUpdateSchema), getPermissions, requirePermissions([UserPermissionsEnum.SUBSCRIPTIONS_UPDATE]), updateSubscription);

router.delete("/:id", getPermissions, requirePermissions([UserPermissionsEnum.SUBSCRIPTIONS_DELETE]), deleteSubscription);

router.get('/:id/restore', getPermissions, restoreSubscription);


export default router;
