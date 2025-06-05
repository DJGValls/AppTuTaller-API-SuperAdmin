import {
    createSubscription,
    deleteSubscription,
    findSubscriptionById,
    findSubscriptions,
    updateSubscription,
} from "controllers/subscriptions.controller";
import { Router } from "express";
import { getPermissions } from "middlewares/auth.middleware";
import { checkRoles } from "middlewares/roles.middleware";
import { validate } from "middlewares/validate.middleware";
import { subscriptionCreateSchema } from "schemas/subscriptions/subscriptionCreate.schema";
import { subscriptionUpdateSchema } from "schemas/subscriptions/subscriptionUpdate.schema";
import subscriptionDurationsRoutes from "./subscriptionDurations.routes.ts";

const router = Router(); 

router.use("/durations", getPermissions, subscriptionDurationsRoutes);

router.get("/", getPermissions, findSubscriptions);

router.get("/:id", getPermissions, findSubscriptionById);

router.post("/", validate(subscriptionCreateSchema), getPermissions, checkRoles, createSubscription);

router.put("/:id", validate(subscriptionUpdateSchema), getPermissions, updateSubscription);

router.delete("/:id", getPermissions, deleteSubscription);


export default router;
