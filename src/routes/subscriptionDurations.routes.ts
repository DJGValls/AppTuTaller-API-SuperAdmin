import {
    createSubscriptionDuration,
    deleteSubscriptionDuration,
    findSubscriptionDurationById,
    findSubscriptionDurations,
    restoreSubscriptionDuration,
    updateSubscriptionDuration,
} from "controllers/subscriptionDurations.controller";
import { Router } from "express";
import { getPermissions } from "middlewares/auth.middleware";
import { checkRoles } from "middlewares/roles.middleware";
import { requirePermissions } from "middlewares/permissions.middleware";
import { validate } from "middlewares/validate.middleware";
import { subscriptionDurationCreateSchema } from "schemas/subscriptionsDurations/subscriptionDurationCreate.schema";
import { subscriptionDurationUpdateSchema } from "schemas/subscriptionsDurations/subscriptionDurationUpdate.schema";
import { UserPermissionsEnum } from "enums/UserPermissions.enums";

const router = Router();

// Solo super admins pueden gestionar duraciones de suscripción
router.get("/", getPermissions, requirePermissions([UserPermissionsEnum.SUBSCRIPTION_DURATIONS_READ]), findSubscriptionDurations);

router.get("/:id", getPermissions, requirePermissions([UserPermissionsEnum.SUBSCRIPTION_DURATIONS_READ]), findSubscriptionDurationById);

router.post("/", validate(subscriptionDurationCreateSchema), getPermissions, requirePermissions([UserPermissionsEnum.SUBSCRIPTION_DURATIONS_CREATE]), createSubscriptionDuration);

router.put("/:id", validate(subscriptionDurationUpdateSchema), getPermissions, requirePermissions([UserPermissionsEnum.SUBSCRIPTION_DURATIONS_UPDATE]), updateSubscriptionDuration);

router.delete("/:id", getPermissions, requirePermissions([UserPermissionsEnum.SUBSCRIPTION_DURATIONS_DELETE]), deleteSubscriptionDuration);

router.get('/:id/restore', getPermissions, requirePermissions([UserPermissionsEnum.SUBSCRIPTION_DURATIONS_UPDATE]), restoreSubscriptionDuration);

export default router;
