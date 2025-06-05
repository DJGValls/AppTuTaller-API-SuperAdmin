import {
    createSubscriptionDuration,
    deleteSubscriptionDuration,
    findSubscriptionDurationById,
    findSubscriptionDurations,
    updateSubscriptionDuration,
} from "controllers/subscriptionDurations.controller";
import { Router } from "express";
import { getPermissions } from "middlewares/auth.middleware";
import { checkRoles } from "middlewares/roles.middleware";
import { validate } from "middlewares/validate.middleware";
import { subscriptionDurationCreateSchema } from "schemas/subscriptionsDurations/subscriptionDurationCreate.schema";
import { subscriptionDurationUpdateSchema } from "schemas/subscriptionsDurations/subscriptionDurationUpdate.schema";

const router = Router();

router.get("/", getPermissions, findSubscriptionDurations);

router.get("/:id", getPermissions, findSubscriptionDurationById);

router.post("/", validate(subscriptionDurationCreateSchema), getPermissions, checkRoles, createSubscriptionDuration);

router.put("/:id", validate(subscriptionDurationUpdateSchema), getPermissions, updateSubscriptionDuration);

router.delete("/:id", getPermissions, deleteSubscriptionDuration);

export default router;
